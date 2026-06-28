const express = require("express");
const { postAnalyticsEvent } = require("../controllers/analyticsController");
const { validateAnalyticsEvent } = require("../middleware/validation");

const router = express.Router();

router.post("/", validateAnalyticsEvent, postAnalyticsEvent);

module.exports = router;
