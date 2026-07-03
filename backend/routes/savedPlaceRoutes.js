import express from 'express';
import SavedPlace from '../models/SavedPlace.js';

const router = express.Router();

// GET /api/saved-places/user/:userId - all saved places for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const places = await SavedPlace.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/saved-places - save a place
router.post('/', async (req, res) => {
  try {
    // avoid duplicate saves of the same place by the same user
    const existing = await SavedPlace.findOne({
      userId: req.body.userId,
      placeRefId: req.body.placeRefId,
    });
    if (existing) return res.status(200).json(existing);

    const place = new SavedPlace(req.body);
    const saved = await place.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/saved-places/:id - unsave a place
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SavedPlace.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Saved place not found' });
    res.json({ message: 'Saved place removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
