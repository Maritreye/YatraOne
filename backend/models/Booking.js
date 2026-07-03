import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingCode: { type: String, required: true, unique: true }, // e.g. "TRN001", "HTL001"
  type: { type: String, enum: ['Train', 'Hotel'], required: true },
  platform: { type: String }, // e.g. "IRCTC redirect", "MakeMyTrip redirect"
  name: { type: String, required: true },
  route: { type: String }, // e.g. "Varanasi → Jaipur" or "Jaipur · 20–22 Jun 2025"
  date: { type: String },
  time: { type: String },
  classOrRoom: { type: String },
  amount: { type: Number, required: true },
  unit: { type: String }, // e.g. "Per person", "Per night"
  status: { type: String, enum: ['Redirected', 'Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  details: { type: mongoose.Schema.Types.Mixed }, // varies: train has fullRoute/departure/arrival; hotel has checkIn/checkOut/nights
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);