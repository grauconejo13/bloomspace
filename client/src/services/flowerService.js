import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/flowers`;

async function pingFlowers() {
    const { data } = await axios.get(`${API_URL}/ping`);
    return data;
}

// A bounded timeout ensures this always resolves or rejects — without it, a hung
// connection to a sleeping backend can leave callers (and any UI state tied to the
// promise settling, like Garden's wake-up banner) waiting indefinitely.
const FETCH_FLOWERS_TIMEOUT_MS = 30000;

async function fetchFlowers() {
    const { data } = await axios.get(API_URL, { timeout: FETCH_FLOWERS_TIMEOUT_MS });
    return data;
}

async function plantFlower({ image, message, author, location, clientPlantId }) {
    const { data } = await axios.post(API_URL, { image, message, author, location, clientPlantId });
    return data;
}

async function waterFlowerById(id) {
    const { data } = await axios.patch(`${API_URL}/${id}/water`);
    return data;
}

export { API_URL, pingFlowers, fetchFlowers, plantFlower, waterFlowerById };
