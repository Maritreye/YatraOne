import express from 'express';
import Itinerary from '../models/Itinerary.js';

const router = express.Router();

// GET /api/itineraries/user/:userId - all itineraries for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/itineraries/:id - single itinerary (full detail, e.g. for ItineraryResult page)
router.get('/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/itineraries - save a generated itinerary (e.g. after Gemini call in Phase 7)
router.post('/', async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const saved = await itinerary.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/itineraries/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Itinerary not found' });
    res.json({ message: 'Itinerary deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
