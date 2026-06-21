const {
    getActiveFlowers,
    createFlower,
    waterFlower,
} = require("../models/Flower");

function getFlowers(req, res) {
    res.json(getActiveFlowers());
}

function postFlower(req, res) {
    const { image, message, author } = req.body;
    const flower = createFlower({ image, message, author });
    res.status(201).json(flower);
}

function waterFlowerById(req, res) {
    const flower = waterFlower(req.params.id);
    if (!flower) {
        return res.status(404).json({ error: "Flower not found." });
    }
    res.json(flower);
}

module.exports = { getFlowers, postFlower, waterFlowerById };
