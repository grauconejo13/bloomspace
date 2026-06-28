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

// Fields that must never reach analytics storage, even if a caller sends them by mistake.
const ANALYTICS_METADATA_BLOCKLIST = ["message", "image", "author", "name", "email", "location"];

function validateAnalyticsEvent(req, res, next) {
    const { event_name } = req.body;

    if (!ANALYTICS_EVENT_NAMES.includes(event_name)) {
        return res.status(400).json({ error: "Invalid event_name." });
    }

    const rawMetadata = req.body.metadata;
    const metadata = rawMetadata && typeof rawMetadata === "object" && !Array.isArray(rawMetadata)
        ? rawMetadata
        : {};

    const safeMetadata = {};
    for (const [key, value] of Object.entries(metadata)) {
        if (!ANALYTICS_METADATA_BLOCKLIST.includes(key.toLowerCase())) {
            safeMetadata[key] = value;
        }
    }

    req.body.metadata = safeMetadata;
    next();
}

module.exports = { validateCreateFlower, validateAnalyticsEvent, ANALYTICS_EVENT_NAMES };
