function validateCreateFlower(req, res, next) {
    const { image, message } = req.body;

    if (!image) {
        return res.status(400).json({ error: "Image is required." });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (trimmedMessage.length < 5 || trimmedMessage.length > 200) {
        return res
            .status(400)
            .json({ error: "Message must be between 5 and 200 characters." });
    }

    req.body.message = trimmedMessage;
    next();
}

module.exports = { validateCreateFlower };
