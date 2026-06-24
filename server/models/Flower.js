const supabase = require("../config/db");

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TABLE = "flowers";

function toCamel(row) {
    if (!row) return null;
    const { planted_at, expires_at, watered_count, ...rest } = row;
    return {
        ...rest,
        plantedAt: planted_at,
        expiresAt: expires_at,
        wateredCount: watered_count,
    };
}

async function getActiveFlowers() {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .gt("expires_at", new Date().toISOString())
        .order("planted_at", { ascending: false });

    if (error) throw error;
    return data.map(toCamel);
}

async function findFlowerById(id) {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return toCamel(data);
}

async function createFlower({ image, message, author, location }) {
    const now = Date.now();
    const row = {
        image,
        message,
        author: author || "Anonymous Gardener",
        location: location || "",
        planted_at: new Date(now).toISOString(),
        expires_at: new Date(now + THREE_DAYS_MS).toISOString(),
        watered_count: 0,
    };

    const { data, error } = await supabase
        .from(TABLE)
        .insert(row)
        .select()
        .single();

    if (error) throw error;
    return toCamel(data);
}

async function waterFlower(id) {
    const existing = await findFlowerById(id);
    if (!existing) return null;

    const { data, error } = await supabase
        .from(TABLE)
        .update({
            expires_at: new Date(Date.now() + THREE_DAYS_MS).toISOString(),
            watered_count: existing.wateredCount + 1,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return toCamel(data);
}

module.exports = {
    getActiveFlowers,
    findFlowerById,
    createFlower,
    waterFlower,
};
