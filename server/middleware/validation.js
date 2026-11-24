function validateCreateFlower(req, res, next) {
    const { image, message } = req.body;

    if (!image) {
        return res.status(400).json({ error: "Image is required." });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (trimmedMessage.length < 5 || trimmedMessage.length > 200) {
        return res
            .status(400)
            .json({ error: "Message must be between 5 and 200 characters." });
    }

    req.body.message = trimmedMessage;
    next();
}

const ANALYTICS_EVENT_NAMES = [
    "page_view",
    "garden_view",
    "flower_created",
    "flower_shared",
    "share_downloaded",
    "support_clicked",
    "photo_uploaded",
];

// Analytics privacy: only these metadata fields are ever stored, per event.
// Anything else (message, image, author, location, nested objects, unknown keys)
// is dropped. Unknown fields are dropped silently rather than rejected, so a
// client/server version mismatch never breaks the app. Analytics is best-effort.
const MAX_PATH_LENGTH = 200;
const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{1,64}$/;

function safePath(value) {
    return typeof value === "string" && value.startsWith("/") && value.length <= MAX_PATH_LENGTH
        ? value
        : undefined;
}

function oneOf(...allowed) {
    return value => (allowed.includes(value) ? value : undefined);
}

const ANALYTICS_METADATA_ALLOWLIST = {
    page_view: { path: safePath },
    garden_view: {},
    flower_created: { method: oneOf("api", "local_fallback") },
    flower_shared: {},
    share_downloaded: {},
    support_clicked: {},
    photo_uploaded: {},
};

function sanitizeAnalyticsMetadata(eventName, rawMetadata) {
    const allowed = ANALYTICS_METADATA_ALLOWLIST[eventName] || {};
    const metadata = rawMetadata && typeof rawMetadata === "object" && !Array.isArray(rawMetadata)
        ? rawMetadata
        : {};

    const safeMetadata = {};
    for (const [key, sanitize] of Object.entries(allowed)) {
        if (!Object.prototype.hasOwnProperty.call(metadata, key)) continue;
        const value = sanitize(metadata[key]);
        if (value !== undefined) safeMetadata[key] = value;
    }
    return safeMetadata;
}

function validateAnalyticsEvent(req, res, next) {
    const { event_name, page, session_id } = req.body;

    if (!ANALYTICS_EVENT_NAMES.includes(event_name)) {
        return res.status(400).json({ error: "Invalid event_name." });
    }

    req.body.metadata = sanitizeAnalyticsMetadata(event_name, req.body.metadata);
    req.body.page = safePath(page) || null;
    req.body.session_id =
        typeof session_id === "string" && SESSION_ID_PATTERN.test(session_id) ? session_id : null;
    next();
}

module.exports = {
    validateCreateFlower,
    validateAnalyticsEvent,
    sanitizeAnalyticsMetadata,
    ANALYTICS_EVENT_NAMES,
    ANALYTICS_METADATA_ALLOWLIST,
};
