import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/flowers`;

async function pingFlowers() {
    const { data } = await axios.get(`${API_URL}/ping`);
    return data;
}

async function fetchFlowers() {
    const { data } = await axios.get(API_URL);
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
