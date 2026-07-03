import express from 'express';
const router = express.Router();

// Turn a city name into lat/lng
router.get('/geocode', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'city query param required' });

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&filter=countrycode:in&limit=1&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    const geoRes = await fetch(url);
    const data = await geoRes.json();
    res.status(geoRes.status).json(data);
  } catch (err) {
    console.error('Geoapify geocode error:', err);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Get nearby places (hotels, tourism, restaurants, shopping) around a lat/lng
router.get('/places', async (req, res) => {
  const { lat, lon, categories } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon query params required' });

  const cats = categories || 'tourism,accommodation.hotel,catering.restaurant,commercial.shopping_mall';

  try {
    const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(cats)}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    const placesRes = await fetch(url);
    const data = await placesRes.json();
    res.status(placesRes.status).json(data);
  } catch (err) {
    console.error('Geoapify places error:', err);
    res.status(500).json({ error: 'Places fetch failed' });
  }
});

export default router;