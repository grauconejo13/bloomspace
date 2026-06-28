const express = require("express");
const {
    pingFlowers,
    getFlowers,
    postFlower,
    waterFlowerById,
} = require("../controllers/flowerController");
const { validateCreateFlower } = require("../middleware/validation");

const router = express.Router();

router.get("/ping", pingFlowers);
router.get("/", getFlowers);
router.post("/", validateCreateFlower, postFlower);
router.patch("/:id/water", waterFlowerById);

module.exports = router;
