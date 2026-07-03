import express from "express";
const router = express.Router();

const BASE_URL = "https://api.geoapify.com/v2/places";
const DETAILS_URL = "https://api.geoapify.com/v2/place-details";

// GET /api/places?lat=..&lon=..&radius=..&category=..&excludeId=..
router.get("/", async (req, res) => {
  try {
    const { lat, lon, radius = 15000, category = "tourism.sights", excludeId } = req.query;
    const url = `${BASE_URL}?categories=${category}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    let features = data.features || [];
    if (excludeId) {
      features = features.filter((f) => f.properties.place_id !== excludeId);
    }
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// GET /api/places/:placeId -> full detail for PlaceDetail.jsx
router.get("/:placeId", async (req, res) => {
  try {
    const url = `${DETAILS_URL}?id=${req.params.placeId}&features=details,building&apiKey=${process.env.GEOAPIFY_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch place detail" });
  }
});

export default router;