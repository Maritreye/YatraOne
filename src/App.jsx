import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import TrainSearch from './pages/TrainSearch'
import TrainDetail from './pages/TrainDetail'
import HotelSearch from './pages/HotelSearch'
import HotelDetail from './pages/HotelDetail'
import TouristPlaces from './pages/TouristPlaces'
import PlaceDetail from './pages/PlaceDetail'
import MapView from './pages/MapView'
import AIItinerary from './pages/AIItinerary'
import ItineraryResult from './pages/ItineraryResult'
import Dashboard from './pages/Dashboard'
import SavedTrips from './pages/SavedTrips'
import BookingHistory from './pages/BookingHistory'
import ProfileSettings from './pages/ProfileSettings'
import NotFound from './pages/NotFound'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/trains" element={<TrainSearch />} />
        <Route path="/trains/:id" element={<TrainDetail />} />
        <Route path="/hotels" element={<HotelSearch />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/places" element={<TouristPlaces />} />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/itinerary" element={<AIItinerary />} />
        <Route path="/itinerary/result/:id" element={<ItineraryResult />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute><SavedTrips /></ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute><BookingHistory /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfileSettings /></ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App