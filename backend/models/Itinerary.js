import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  preferences: {
    travellerType: { type: String }, // solo/couple/family/group
    style: { type: String }, // relaxed/balanced/packed
    interests: [{ type: String }],
    accommodation: { type: String },
    budget: { type: Number },
  },
  stats: [{ type: String }], // e.g. ["3 Days", "1 Train", "1 Hotel", "8 Places"]
  expenses: [{
    label: String,
    amount: Number,
    color: String,
  }],
days: [{
  day: Number,
  date: String,
  activities: { type: [mongoose.Schema.Types.Mixed] },
}],
  weatherTrip: [{
    date: String,
    icon: String,
    condition: String,
    temp: String,
  }],
  tips: [{
    icon: String,
    text: String,
  }],
  trainInfo: { type: Object },
  hotelInfo: { type: Object },
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);