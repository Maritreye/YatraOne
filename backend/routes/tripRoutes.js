import express from 'express';
import Trip from '../models/Trip.js';

const router = express.Router();

// GET /api/trips/user/:userId - all trips for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trips/:id - single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trips - create trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const saved = await trip.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/trips/:id - update trip
router.put('/:id', async (req, res) => {
  try {
    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Trip not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
