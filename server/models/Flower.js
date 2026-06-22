const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const flowers = [];

function getActiveFlowers() {
    const now = Date.now();
    return flowers.filter((flower) => new Date(flower.expiresAt).getTime() > now);
}

function findFlowerById(id) {
    return flowers.find((flower) => flower.id === id);
}

function createFlower({ image, message, author, location }) {
    const now = Date.now();
    const flower = {
        id: now.toString(),
        image,
        message,
        author: author || "Anonymous Gardener",
        location: location || "",
        plantedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + THREE_DAYS_MS).toISOString(),
        wateredCount: 0,
    };
    flowers.push(flower);
    return flower;
}

function waterFlower(id) {
    const flower = findFlowerById(id);
    if (!flower) return null;
    flower.expiresAt = new Date(Date.now() + THREE_DAYS_MS).toISOString();
    flower.wateredCount += 1;
    return flower;
}

module.exports = {
    getActiveFlowers,
    findFlowerById,
    createFlower,
    waterFlower,
};
