import mongoose from 'mongoose';

const savedPlaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeRefId: { type: Number }, // matches places.json numeric "id" field
  name: { type: String, required: true },
  city: { type: String },
  category: { type: String },
  rating: { type: Number },
  img: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('SavedPlace', savedPlaceSchema);