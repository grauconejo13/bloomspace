const {
    pingDatabase,
    getActiveFlowers,
    createFlower,
    waterFlower,
} = require("../models/Flower");

async function pingFlowers(req, res) {
    try {
        await pingDatabase();
        res.json({ ok: true });
    } catch (error) {
        console.error("pingFlowers error:", error);
        res.status(503).json({ ok: false, error: "Database is waking up." });
    }
}

async function getFlowers(req, res) {
    try {
        const flowers = await getActiveFlowers();
        res.json(flowers);
    } catch (error) {
        console.error("getFlowers error:", error);
        res.status(500).json({ error: "Failed to load flowers." });
    }
}

// In-memory idempotency cache: protects against duplicate POSTs (retries, double
// network sends) sharing the same client-generated clientPlantId. Process-local and
// short-lived by design — it's a secondary safeguard, not the primary defense (that's
// the frontend's isSubmitting guard). No DB schema change required.
const recentPlantsByClientId = new Map();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

function pruneExpiredIdempotencyEntries() {
    const cutoff = Date.now() - IDEMPOTENCY_TTL_MS;
    for (const [key, entry] of recentPlantsByClientId) {
        if (entry.createdAt < cutoff) recentPlantsByClientId.delete(key);
    }
}

async function postFlower(req, res) {
    try {
        const { image, message, author, location, clientPlantId } = req.body;

        if (clientPlantId) {
            pruneExpiredIdempotencyEntries();
            const cached = recentPlantsByClientId.get(clientPlantId);
            if (cached) {
                return res.status(200).json(cached.flower);
            }
        }

        const flower = await createFlower({ image, message, author, location });

        if (clientPlantId) {
            recentPlantsByClientId.set(clientPlantId, { flower, createdAt: Date.now() });
        }

        res.status(201).json(flower);
    } catch (error) {
        console.error("postFlower error:", error);
        res.status(500).json({ error: "Failed to plant flower." });
    }
}

async function waterFlowerById(req, res) {
    try {
        const flower = await waterFlower(req.params.id);
        if (!flower) {
            return res.status(404).json({ error: "Flower not found." });
        }
        res.json(flower);
    } catch (error) {
        console.error("waterFlowerById error:", error);
        res.status(500).json({ error: "Failed to water flower." });
    }
}

module.exports = { pingFlowers, getFlowers, postFlower, waterFlowerById };
