const { recordEvent } = require("../models/AnalyticsEvent");

async function postAnalyticsEvent(req, res) {
    const { event_name, page, metadata, session_id } = req.body;

    try {
        await recordEvent({ eventName: event_name, page, metadata, sessionId: session_id });
    } catch (error) {
        // Analytics is best-effort and must never surface as a user-facing failure —
        // e.g. before the analytics_events table migration has been run.
        console.error("postAnalyticsEvent error:", error);
    }

    res.status(200).json({ success: true });
}

module.exports = { postAnalyticsEvent };
