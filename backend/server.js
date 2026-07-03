import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import savedPlaceRoutes from './routes/savedPlaceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import placesRoutes from "./routes/placesRoutes.js";
import aiRoutes from './routes/aiRoutes.js';
import geoRoutes from './routes/geoRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/saved-places', savedPlaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use("/api/places", placesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/geo', geoRoutes);

let dbStatus = "disconnected";

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    dbStatus = "connected";
    console.log("MongoDB connected");
  })
  .catch((err) => {
    dbStatus = "error";
    console.error("MongoDB connection error:", err.message);
  });

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "YatraOne backend is running",
    database: dbStatus,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});