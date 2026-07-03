# YatraOne — Indian Travel Platform

YatraOne is a full-stack travel planning platform for exploring destinations across India — search trains and hotels, discover tourist attractions, generate AI-powered itineraries, and manage your trips, all in one place.

Built as a college full-stack project.


## Features

- 🔐 **Authentication** — Firebase Email/Password auth with protected routes
- 🚆 **Train & Hotel Search** — browse listings with detailed pages
- 🗺️ **Tourist Places Explorer** — live points-of-interest data via Geoapify Places API
- 🤖 **AI Itinerary Generator** — Groq-powered (Llama 3.1) custom trip itineraries, with automatic fallback to mock data if the AI call fails
- 🗺️ **Interactive Map** — Leaflet.js map with location pins
- 📊 **Dashboard** — trips, saved places, bookings, and itineraries at a glance
- 💾 **Saved Trips & Booking History** — full trip management


## Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React + Vite, React Router, inline styling |
| Backend    | Node.js + Express (ES Modules) |
| Database   | MongoDB Atlas + Mongoose |
| Auth       | Firebase Authentication |
| AI         | Groq API (Llama 3.1 8B Instant / Llama 3.3 70B Versatile) |
| Maps and Places API | Geoapify Places API |


## Project Structure

```
YatraOne/
├── src/
│   ├── data/              # Mock JSON data (trains, hotels, cities, etc.)
│   ├── components/        # Shared components (ProtectedRoute, etc.)
│   ├── assets/            # Static assets, placeholder illustrations
│   ├── pages/              # All app pages/routes
│   ├── firebase.js        # Firebase app + auth config
│   ├── AuthContext.jsx     # Auth provider + useAuth hook
│   └── main.jsx
├── backend/
│   ├── models/             # Mongoose schemas (User, Trip, Booking, etc.)
│   ├── routes/              # Express API routes
│   ├── config/
│   ├── server.js
│   └── package.json
└── README.md
```


## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas account + connection string
- A Firebase project with Email/Password auth enabled
- A free [Geoapify](https://myprojects.geoapify.com/) API key
- A free [Groq](https://console.groq.com/) API key (no credit card required for the free tier)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/YatraOne.git
cd YatraOne
```

### 2. Frontend setup
```bash
npm install
```

Create a `.env` file in the project root:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Run the frontend:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173` (default Vite port).

### 3. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEOAPIFY_KEY=your_geoapify_api_key_here
```

Run the backend:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### 4. Firebase config
Update `src/firebase.js` with your own Firebase project config (apiKey, authDomain, projectId, etc.) from the Firebase console.


## Environment Variables Summary

| File | Variable | Description |
|------|----------|--------------|
| `.env` (root) | `VITE_GROQ_API_KEY` | Groq API key for AI itinerary generation |
| `backend/.env` | `PORT` | Backend server port (default 5000) |
| `backend/.env` | `MONGO_URI` | MongoDB Atlas connection string |
| `backend/.env` | `GEOAPIFY_KEY` | Geoapify API key for tourist places data |

> ⚠️ Never commit `.env` files. They're excluded via `.gitignore` in both the root and `backend/` folders.


## Notes

- Train and hotel data currently use mock data (`src/data/`) — real booking integrations are out of scope for this project.
- Tourist place images are shown as generic doodle illustrations rather than real photos, since the free-tier Places API doesn't reliably provide photos for arbitrary points of interest — showing a stock photo of an unrelated landmark would be misleading.
- The AI itinerary generator calls Groq's OpenAI-compatible chat completions endpoint directly from the frontend using `import.meta.env.VITE_GROQ_API_KEY`. If the Groq request or JSON parsing fails for any reason, the app automatically falls back to building a realistic itinerary from local mock data, using the traveller's actual input (route, dates, budget, group size) so nothing shown is hardcoded.
- Hotel pricing accounts for the number of rooms needed based on group size (roughly 2 travellers per room), and hotel star ratings are constrained in code to stay consistent with the selected accommodation tier (Budget / 3 Star / 4-5 Star / Homestay), regardless of what the AI returns.


## License

Built for academic purposes.