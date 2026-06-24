const {
    getActiveFlowers,
    createFlower,
    waterFlower,
} = require("../models/Flower");

async function getFlowers(req, res) {
    try {
        const flowers = await getActiveFlowers();
        res.json(flowers);
    } catch (error) {
        console.error("getFlowers error:", error);
        res.status(500).json({ error: "Failed to load flowers." });
    }
}

async function postFlower(req, res) {
    try {
        const { image, message, author, location } = req.body;
        const flower = await createFlower({ image, message, author, location });
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

module.exports = { getFlowers, postFlower, waterFlowerById };
