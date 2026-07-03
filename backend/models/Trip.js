import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Draft', 'Cancelled'], default: 'Draft' },
  dates: { type: String }, // display string e.g. "20–22 Jun 2025", matches frontend format
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: String }, // e.g. "3 Days 2 Nights"
  travellers: { type: String }, // e.g. "2 travellers"
  budget: { type: String }, // e.g. "₹15,000 budget"
  trainStatus: { type: String }, // e.g. "Train booked" / "Train pending"
  hotelStatus: { type: String },
  placesCount: { type: Number, default: 0 },
  img: { type: String },
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);