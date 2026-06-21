const express = require("express");
const cors = require("cors");
require("dotenv").config();

const flowerRoutes = require("./routes/flowerRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.json({ message: "Bloomspace API running 🌸" });
});

app.use("/api/flowers", flowerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});