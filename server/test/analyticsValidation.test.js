const test = require("node:test");
const assert = require("node:assert/strict");
const {
    validateAnalyticsEvent,
    sanitizeAnalyticsMetadata,
    ANALYTICS_EVENT_NAMES,
    ANALYTICS_METADATA_ALLOWLIST,
} = require("../middleware/validation");

function run(body) {
    const req = { body: structuredClone(body) };
    const res = {
        statusCode: 200,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.payload = payload; return this; },
    };
    let nextCalled = false;
    validateAnalyticsEvent(req, res, () => { nextCalled = true; });
    return { req, res, nextCalled };
}

test("every allowed event name has an explicit metadata allowlist", () => {
    for (const name of ANALYTICS_EVENT_NAMES) {
        assert.ok(Object.prototype.hasOwnProperty.call(ANALYTICS_METADATA_ALLOWLIST, name), name);
    }
});

test("unknown event names are rejected", () => {
    const { res, nextCalled } = run({ event_name: "steal_data", metadata: {} });
    assert.equal(res.statusCode, 400);
    assert.equal(nextCalled, false);
});

test("what the client sends today is kept", () => {
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", { path: "/garden" }), { path: "/garden" });
    assert.deepEqual(sanitizeAnalyticsMetadata("flower_created", { method: "api" }), { method: "api" });
    assert.deepEqual(sanitizeAnalyticsMetadata("flower_created", { method: "local_fallback" }), { method: "local_fallback" });
    assert.deepEqual(sanitizeAnalyticsMetadata("garden_view", {}), {});
});

test("personal content never survives, whatever the key name or nesting", () => {
    const leaky = {
        message: "my private note",
        msg: "my private note",
        text: "my private note",
        Author: "Vanessa",
        email: "a@b.c",
        location: "Texas",
        image: "data:image/png;base64,AAAA",
        nested: { message: "hidden" },
        path: "/garden",
        method: "api",
    };
    for (const name of ANALYTICS_EVENT_NAMES) {
        const out = sanitizeAnalyticsMetadata(name, leaky);
        const serialized = JSON.stringify(out);
        for (const secret of ["private note", "Vanessa", "a@b.c", "Texas", "base64", "hidden"]) {
            assert.ok(!serialized.includes(secret), `${name} leaked ${secret}: ${serialized}`);
        }
        // Only keys from that event's allowlist can appear.
        for (const key of Object.keys(out)) {
            assert.ok(key in ANALYTICS_METADATA_ALLOWLIST[name], `${name} kept unexpected key ${key}`);
        }
    }
});

test("allowed keys with wrong-typed or unexpected values are dropped", () => {
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", { path: { message: "x" } }), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", { path: "not-a-path" }), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", { path: "/" + "a".repeat(300) }), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("flower_created", { method: "my private note" }), {});
});

test("non-object metadata becomes empty, and inherited keys are ignored", () => {
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", "string"), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", ["/garden"]), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", null), {});
    assert.deepEqual(sanitizeAnalyticsMetadata("page_view", Object.create({ path: "/garden" })), {});
});

test("page and session_id are bounded too", () => {
    const ok = run({ event_name: "page_view", page: "/create", session_id: "4f0c2a1e-9b7d-4e3a-8c21-0f6b5d9e7a10", metadata: { path: "/create" } });
    assert.equal(ok.nextCalled, true);
    assert.equal(ok.req.body.page, "/create");
    assert.equal(ok.req.body.session_id, "4f0c2a1e-9b7d-4e3a-8c21-0f6b5d9e7a10");

    // Fallback id format used by the client when crypto.randomUUID is missing.
    const fallback = run({ event_name: "garden_view", session_id: "1795494193778-k3j2h1g" });
    assert.equal(fallback.req.body.session_id, "1795494193778-k3j2h1g");

    const bad = run({ event_name: "page_view", page: "my private note", session_id: "<script>x</script>", metadata: {} });
    assert.equal(bad.nextCalled, true);
    assert.equal(bad.req.body.page, null);
    assert.equal(bad.req.body.session_id, null);
});
