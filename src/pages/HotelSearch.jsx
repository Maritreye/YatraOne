import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import hotels from "../data/hotels.json";


export default function HotelSearch() {
  const navigate = useNavigate()
  const [selectedStars, setSelectedStars] = useState([])
  const [selectedDistance, setSelectedDistance] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedPropertyType, setSelectedPropertyType] = useState([])
  const [selectedRating, setSelectedRating] = useState([])
  const [sortBy, setSortBy] = useState('Popularity')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [viewMode, setViewMode] = useState('list')

  const toggleItem = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const clearAll = () => {
    setSelectedStars([])
    setSelectedDistance([])
    setSelectedAmenities([])
    setSelectedPropertyType([])
    setSelectedRating([])
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ height: '64px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 80px', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
          Yatra<span style={{ color: '#2563EB' }}>One</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[{ label: 'Trains', path: '/trains' }, { label: 'Hotels', path: '/hotels' }, { label: 'Places', path: '/places' }, { label: 'AI Planner', path: '/itinerary' }].map((l) => (
            <span key={l.label} onClick={() => navigate(l.path)} style={{ fontSize: '14px', color: l.label === 'Hotels' ? '#2563EB' : '#64748B', cursor: 'pointer', fontWeight: l.label === 'Hotels' ? 600 : 400 }}>{l.label}</span>
          ))}
        </div>
        <button onClick={() => navigate('/login')} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Log in</button>
      </nav>

      {/* Search Summary Bar */}
      <div style={{ background: '#EFF6FF', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', borderBottom: '1px solid #DBEAFE' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#1E293B' }}>
          🏨 Hotels in Jaipur &nbsp;·&nbsp; 20–22 Jun &nbsp;·&nbsp; 2 Guests &nbsp;·&nbsp; 1 Room
        </span>
        <button style={{ border: '1.5px solid #2563EB', background: 'transparent', color: '#2563EB', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
          Edit Search
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', padding: '24px 80px', gap: '32px', alignItems: 'flex-start' }}>

        {/* Filter Sidebar */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>Filters</span>
            <span onClick={clearAll} style={{ fontSize: '14px', color: '#2563EB', cursor: 'pointer' }}>Clear all</span>
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Price Range */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Price per night</p>
            <input type="range" min="500" max="10000" defaultValue="3000" style={{ width: '100%', accentColor: '#2563EB' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>₹500</span>
              <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 500 }}>₹500 — ₹3,000</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>₹10,000</span>
            </div>
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Star Rating */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Star rating</p>
            {[5, 4, 3, 2, 1].map((s) => (
              <div key={s} onClick={() => toggleItem(selectedStars, setSelectedStars, s)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                <div style={{ width: '20px', height: '20px', border: `1.5px solid ${selectedStars.includes(s) ? '#2563EB' : '#E2E8F0'}`, borderRadius: '4px', background: selectedStars.includes(s) ? '#2563EB' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selectedStars.includes(s) && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ fontSize: '14px', color: '#F59E0B' }}>{'★'.repeat(s)}{'☆'.repeat(5 - s)}</span>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{s} Star</span>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Distance */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Distance from station</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['Under 1 km', '1–3 km', '3–5 km', '5+ km'].map((d) => (
                <button key={d} onClick={() => toggleItem(selectedDistance, setSelectedDistance, d)}
                  style={{ border: `1.5px solid ${selectedDistance.includes(d) ? '#2563EB' : '#E2E8F0'}`, background: selectedDistance.includes(d) ? '#EFF6FF' : '#fff', color: selectedDistance.includes(d) ? '#2563EB' : '#64748B', borderRadius: '20px', padding: '8px 0', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Amenities</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['Free WiFi', 'Swimming Pool', 'Free Parking', 'AC Rooms', 'Restaurant', 'Room Service', 'Gym', 'Airport Shuttle'].map((a) => (
                <div key={a} onClick={() => toggleItem(selectedAmenities, setSelectedAmenities, a)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', border: `1.5px solid ${selectedAmenities.includes(a) ? '#2563EB' : '#E2E8F0'}`, borderRadius: '3px', background: selectedAmenities.includes(a) ? '#2563EB' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedAmenities.includes(a) && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Property Type */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Property type</p>
            {['Hotel', 'Resort', 'Guest House', 'Homestay', 'OYO Rooms'].map((t) => (
              <div key={t} onClick={() => toggleItem(selectedPropertyType, setSelectedPropertyType, t)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                <div style={{ width: '20px', height: '20px', border: `1.5px solid ${selectedPropertyType.includes(t) ? '#2563EB' : '#E2E8F0'}`, borderRadius: '4px', background: selectedPropertyType.includes(t) ? '#2563EB' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selectedPropertyType.includes(t) && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ fontSize: '14px', color: '#64748B' }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: '#E2E8F0', marginBottom: '20px' }}></div>

          {/* Guest Rating */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: '0 0 12px 0' }}>Guest rating</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['9+ Excellent', '8+ Very Good', '7+ Good', '6+ Pleasant'].map((r) => (
                <button key={r} onClick={() => toggleItem(selectedRating, setSelectedRating, r)}
                  style={{ border: `1.5px solid ${selectedRating.includes(r) ? '#2563EB' : '#E2E8F0'}`, background: selectedRating.includes(r) ? '#EFF6FF' : '#fff', color: selectedRating.includes(r) ? '#2563EB' : '#64748B', borderRadius: '20px', padding: '8px 0', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Results */}
        <div style={{ flex: 1 }}>

          {/* Results Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#1E293B' }}>{hotels.length} hotels found in Jaipur</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

              {/* View Toggle */}
              <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setViewMode('list')} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', background: viewMode === 'list' ? '#2563EB' : '#fff', color: viewMode === 'list' ? '#fff' : '#64748B' }}>
                  ☰ List
                </button>
                <button onClick={() => setViewMode('map')} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', borderLeft: '1px solid #E2E8F0', background: viewMode === 'map' ? '#2563EB' : '#fff', color: viewMode === 'map' ? '#fff' : '#64748B' }}>
                  🗺 Map
                </button>
              </div>

              {/* Sort */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{ border: '1.5px solid #E2E8F0', background: '#fff', borderRadius: '8px', padding: '8px 14px', fontSize: '14px', color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Sort by: {sortBy} ▾
                </button>
                {showSortDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '42px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', zIndex: 50, minWidth: '220px', overflow: 'hidden' }}>
                    {['Popularity', 'Price: Low to High', 'Price: High to Low', 'Guest Rating', 'Distance from Station'].map((opt) => (
                      <div key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false) }}
                        style={{ padding: '12px 16px', fontSize: '14px', color: sortBy === opt ? '#2563EB' : '#1E293B', background: sortBy === opt ? '#EFF6FF' : '#fff', cursor: 'pointer', fontWeight: sortBy === opt ? 500 : 400 }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div style={{ background: '#E2E8F0', borderRadius: '12px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                <p style={{ fontSize: '15px', color: '#64748B' }}>Map view coming soon</p>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>Leaflet.js map will be integrated here</p>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {hotels.map((hotel) => (
                <div key={hotel.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>

                  {/* Hotel Image */}
                  <div style={{ width: '220px', flexShrink: 0, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px' }}>
                    {hotel.icon}
                  </div>

                  {/* Hotel Info */}
                  <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>

                      {/* Name + Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>{hotel.name}</h3>
                        <span style={{ fontSize: '13px', color: '#F59E0B' }}>{'★'.repeat(hotel.stars)}</span>
                      </div>

                      {/* Location */}
                      <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>
                        📍 {hotel.location}
                      </div>

                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>
                          {hotel.rating} ★ {hotel.ratingLabel}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>({hotel.reviews} reviews)</span>
                      </div>

                      {/* Amenities */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {hotel.amenities.map((a) => (
                          <span key={a} style={{ fontSize: '12px', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '3px 10px' }}>{a}</span>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {hotel.highlights.map((h) => (
                          <span key={h} style={{ fontSize: '12px', color: '#166534', fontWeight: 500 }}>✓ {h}</span>
                        ))}
                      </div>
                    </div>

                    {/* Price Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: '180px', paddingLeft: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Per night</div>
                        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>₹{hotel.price.toLocaleString()}</div>
                        <div style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through', marginBottom: '4px' }}>₹{hotel.originalPrice.toLocaleString()}</div>
                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{hotel.discount}% off</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <button onClick={() => window.open('https://www.makemytrip.com', '_blank')}
                          style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                          Book on MakeMyTrip ↗
                        </button>
                        <button onClick={() => window.open('https://www.oyorooms.com', '_blank')}
                          style={{ background: '#fff', color: '#2563EB', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                          View on OYO ↗
                        </button>
                        <span onClick={() => window.open('https://www.goibibo.com', '_blank')}
                          style={{ fontSize: '12px', color: '#2563EB', textAlign: 'center', cursor: 'pointer' }}>
                          Check on Goibibo ↗
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}