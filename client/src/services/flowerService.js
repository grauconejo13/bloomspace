import axios from "axios";

const API_URL = "http://localhost:5000/api/flowers";

async function fetchFlowers() {
    const { data } = await axios.get(API_URL);
    return data;
}

async function plantFlower({ image, message, author, location }) {
    const { data } = await axios.post(API_URL, { image, message, author, location });
    return data;
}

async function waterFlowerById(id) {
    const { data } = await axios.patch(`${API_URL}/${id}/water`);
    return data;
}

export { API_URL, fetchFlowers, plantFlower, waterFlowerById };
