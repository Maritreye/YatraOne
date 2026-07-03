import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// GET /api/bookings/user/:userId - all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:bookingCode - lookup by booking code (e.g. TRN001, HTL001)
router.get('/:bookingCode', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingCode: req.params.bookingCode });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/bookings/:id - update booking (e.g. status change)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
