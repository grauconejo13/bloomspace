const supabase = require("../config/db");

const TABLE = "analytics_events";

async function recordEvent({ eventName, page, metadata, sessionId }) {
    const row = {
        event_name: eventName,
        page: page || null,
        metadata: metadata && typeof metadata === "object" ? metadata : {},
        session_id: sessionId || null,
    };

    const { data, error } = await supabase
        .from(TABLE)
        .insert(row)
        .select()
        .single();

    if (error) throw error;
    return data;
}

module.exports = { recordEvent };
