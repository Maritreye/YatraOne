import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories as CATEGORIES } from "../data/places.json";
import placeholderLandmark from "../assets/placeholders/placeholder-landmark.svg";
import placeholderMarket from "../assets/placeholders/placeholder-market.svg";
import placeholderNature from "../assets/placeholders/placeholder-nature.svg";

// Jaipur city center — used as the search origin for the Places API.
// Swap these if you ever support other cities.
const CITY_COORDS = { lat: 26.9124, lon: 75.7873 };
const SEARCH_RADIUS = 15000; // meters

// Maps your existing category chip labels to Geoapify category keys.
// Adjust these strings to match whatever labels are actually inside
// src/data/places.json -> categories. Unmatched labels fall back to
// "tourism.sights".
const CATEGORY_MAP = {
  "All Places": "tourism.sights,tourism.attraction",
  Historical: "tourism.sights,heritage",
  Food: "catering.restaurant,catering.cafe",
  Shopping: "commercial.shopping_mall,commercial.marketplace",
  Religious: "tourism.sights",
  Nature: "natural,leisure.park",
  Museums: "entertainment.museum",
  Markets: "commercial.marketplace",
};

// Geoapify's free tier does NOT return images, ratings, reviews,
// hours, or entry fees. IMPORTANT: we deliberately use generic doodle
// illustrations here instead of real stock photos of famous landmarks
// (e.g. Taj Mahal), since showing a real photo of a specific place next
// to an unrelated POI's name is misleading to the user.
const PLACEHOLDER_IMAGES = [placeholderLandmark, placeholderMarket, placeholderNature];

function normalizePlace(feature, index) {
  const p = feature.properties || {};
  return {
    id: p.place_id,
    name: p.name || "Unnamed Place",
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length], // placeholder — no image data from API
    category: (p.categories && p.categories[0]) || "attraction",
    rating: 4.3, // placeholder — not available on free tier
    reviews: 0, // placeholder
    location: p.address_line2 || p.formatted || "Jaipur, Rajasthan",
    distance: p.distance ? `${(p.distance / 1000).toFixed(1)} km away` : "Distance unknown",
    hours: "Hours not listed", // placeholder
    fee: "Check on arrival", // placeholder
    bestTime: "Morning", // placeholder
    lat: p.lat,
    lon: p.lon,
  };
}

function CategoryChip({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "8px 20px",
        borderRadius: "20px",
        border: active ? "none" : "1px solid #E2E8F0",
        backgroundColor: active ? "#2563EB" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#64748B",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
}

function FilterChipGroup({ title, options, selected, onSelect }) {
  return (
    <div style={{ paddingTop: "20px", paddingBottom: "20px", borderBottom: "1px solid #E2E8F0" }}>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          color: "#1E293B",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <div
              key={opt}
              onClick={() => onSelect(active ? "" : opt)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: active ? "none" : "1px solid #E2E8F0",
                backgroundColor: active ? "#2563EB" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#64748B",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGroup({ title, options, checkedItems, onToggle }) {
  return (
    <div style={{ paddingTop: "20px", paddingBottom: "20px", borderBottom: "1px solid #E2E8F0" }}>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          color: "#1E293B",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {options.map((opt) => {
          const checked = checkedItems.includes(opt);
          return (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#475569",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
                style={{ width: "16px", height: "16px", accentColor: "#2563EB" }}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function WishlistHeart({ saved, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: saved ? "#FEE2E2" : "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "16px",
        color: saved ? "#EF4444" : "#64748B",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }}
    >
      {saved ? "♥" : "♡"}
    </div>
  );
}

function PlaceCardGrid({ place, saved, onToggleWishlist, onView }) {
  return (
    <div
      style={{
        width: "300px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "200px", backgroundColor: "#D1D5DB" }}>
        <img
          src={place.image}
          alt={place.name}
          style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "rgba(0,0,0,0.55)",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          {place.category}
        </div>
        <WishlistHeart saved={saved} onClick={() => onToggleWishlist(place.id)} />
      </div>
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "16px", color: "#1E293B" }}>
          {place.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#F59E0B", fontSize: "13px" }}>★</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#1E293B" }}>
            {place.rating}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#94A3B8" }}>
            ({place.reviews.toLocaleString()} reviews)
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", color: "#64748B" }}>📍</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>
            {place.location}
          </span>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#94A3B8" }}>
          {place.distance}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", color: "#64748B" }}>🕒</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B" }}>
            {place.hours}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", color: "#64748B" }}>🎫</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B" }}>
            {place.fee}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              backgroundColor: "#DBEAFE",
              color: "#1D4ED8",
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            Best time: {place.bestTime}
          </div>
          <div
            onClick={() => onView(place.id)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#2563EB",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceCardList({ place, saved, onToggleWishlist, onView, navigate }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div style={{ position: "relative", width: "180px", height: "140px", flexShrink: 0 }}>
        <img
          src={place.image}
          alt={place.name}
          style={{ width: "180px", height: "140px", objectFit: "cover", borderRadius: "12px", display: "block" }}
        />
        <WishlistHeart saved={saved} onClick={() => onToggleWishlist(place.id)} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "16px", color: "#1E293B" }}>
          {place.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#F59E0B", fontSize: "13px" }}>★</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#1E293B" }}>
            {place.rating}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#94A3B8" }}>
            ({place.reviews.toLocaleString()} reviews)
          </span>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>
          📍 {place.location} · {place.distance}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B" }}>
          🕒 {place.hours} &nbsp;&nbsp; 🎫 {place.fee}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#475569", marginTop: "4px" }}>
          A popular spot in Jaipur known for its history and charm. Best visited during {place.bestTime.toLowerCase()} for the ideal experience.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "8px" }}>
          <div
            onClick={() => navigate("/map")}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#2563EB",
              cursor: "pointer",
              alignSelf: "center",
            }}
          >
            View on Map
          </div>
          <div
            onClick={() => onView(place.id)}
            style={{
              backgroundColor: "#0F766E",
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Add to itinerary +
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TouristPlaces() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All Places");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Recommended");
  const [wishlist, setWishlist] = useState([]);

  const [distance, setDistance] = useState("");
  const [rating, setRating] = useState("");
  const [hoursChecked, setHoursChecked] = useState([]);
  const [feeChecked, setFeeChecked] = useState([]);
  const [bestTimeChecked, setBestTimeChecked] = useState([]);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const category = CATEGORY_MAP[activeCategory] || "tourism.sights";
        const res = await fetch(
          `http://localhost:5000/api/places?lat=${CITY_COORDS.lat}&lon=${CITY_COORDS.lon}&radius=${SEARCH_RADIUS}&category=${category}`
        );
        if (!res.ok) throw new Error("Failed to load places");
        const data = await res.json();
        setPlaces(data.map((feature, i) => normalizePlace(feature, i)));
      } catch (err) {
        setError("Couldn't load places right now. Please try again.");
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [activeCategory]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const toggleChecked = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));
  };

  const handleClearAll = () => {
    setDistance("");
    setRating("");
    setHoursChecked([]);
    setFeeChecked([]);
    setBestTimeChecked([]);
  };

  // Only distance is real data — rating/hours/fee filters are left as UI-only
  // for now since Geoapify's free tier doesn't return those fields.
  const filteredPlaces = places.filter((p) => {
    if (!distance) return true;
    const km = parseFloat(p.distance);
    if (Number.isNaN(km)) return true;
    if (distance === "Under 2 km") return km < 2;
    if (distance === "2–5 km") return km >= 2 && km <= 5;
    if (distance === "5–10 km") return km >= 5 && km <= 10;
    if (distance === "10+ km") return km > 10;
    return true;
  });

  const FEATURED = filteredPlaces[0];

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Navbar */}
      <div
        style={{
          width: "100%",
          height: "72px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#2563EB",
            cursor: "pointer",
          }}
        >
          YatraOne
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {[
            { label: "Trains", path: "/trains" },
            { label: "Hotels", path: "/hotels" },
            { label: "Places", path: "/places" },
            { label: "Map", path: "/map" },
            { label: "AI Itinerary", path: "/itinerary" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: item.label === "Places" ? "#2563EB" : "#475569",
                fontWeight: item.label === "Places" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "280px",
          backgroundColor: "#D1D5DB",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "36px", color: "#FFFFFF" }}>
            Explore Jaipur
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
            The Pink City · Rajasthan
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {[`${filteredPlaces.length} Places Found`].map((stat) => (
              <div
                key={stat}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div
        style={{
          width: "100%",
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 80px",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          padding: "32px 80px",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* Filter Sidebar */}
        <div style={{ width: "280px", flexShrink: 0, paddingTop: "0px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
            }}
          >
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#1E293B" }}>
              Filters
            </div>
            <div
              onClick={handleClearAll}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#2563EB",
                cursor: "pointer",
              }}
            >
              Clear all
            </div>
          </div>

          <FilterChipGroup title="Distance from city center" options={distanceOptionsList} selected={distance} onSelect={setDistance} />
          <FilterChipGroup title="Visitor Rating" options={ratingOptionsList} selected={rating} onSelect={setRating} />
          <CheckboxGroup title="Opening hours" options={hoursOptionsList} checkedItems={hoursChecked} onToggle={toggleChecked(setHoursChecked)} />
          <CheckboxGroup title="Entry fee" options={feeOptionsList} checkedItems={feeChecked} onToggle={toggleChecked(setFeeChecked)} />
          <CheckboxGroup title="Best time to visit" options={bestTimeOptionsList} checkedItems={bestTimeChecked} onToggle={toggleChecked(setBestTimeChecked)} />
        </div>

        {/* Places Column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Featured Place Banner */}
          {FEATURED && (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "200px",
                backgroundColor: "#D1D5DB",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={FEATURED.image}
                alt={FEATURED.name}
                style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.55)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#FEF9C3",
                  color: "#854D0E",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                Featured
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  right: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px", color: "#FFFFFF" }}>
                    {FEATURED.name}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#FFFFFF" }}>
                    ★ {FEATURED.rating} · {FEATURED.distance}
                  </div>
                </div>
                <div
                  onClick={() => navigate(`/places/${encodeURIComponent(FEATURED.id)}`)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#1E293B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Explore →
                </div>
              </div>
            </div>
          )}

          {/* Results header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#475569" }}>
              {loading ? "Loading places..." : `${filteredPlaces.length} places found`}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#475569",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option>Recommended</option>
                <option>Nearest First</option>
              </select>
              <div style={{ display: "flex", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                <div
                  onClick={() => setView("grid")}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: view === "grid" ? "#2563EB" : "#FFFFFF",
                    color: view === "grid" ? "#FFFFFF" : "#64748B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Grid
                </div>
                <div
                  onClick={() => setView("list")}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: view === "list" ? "#2563EB" : "#FFFFFF",
                    color: view === "list" ? "#FFFFFF" : "#64748B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  List
                </div>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#EF4444" }}>{error}</div>
          )}

          {/* Places Grid / List */}
          {!loading && filteredPlaces.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "40px", color: "#CBD5E1" }}>🗺️</div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px", color: "#1E293B" }}>
                No places found
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B" }}>
                Try selecting a different category
              </div>
              <div
                onClick={() => setActiveCategory("All Places")}
                style={{
                  marginTop: "8px",
                  border: "1px solid #2563EB",
                  color: "#2563EB",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Show all places
              </div>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {filteredPlaces.map((place) => (
                <PlaceCardGrid
                  key={place.id}
                  place={place}
                  saved={wishlist.includes(place.id)}
                  onToggleWishlist={toggleWishlist}
                  onView={(id) => navigate(`/places/${encodeURIComponent(id)}`)}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredPlaces.map((place) => (
                <PlaceCardList
                  key={place.id}
                  place={place}
                  saved={wishlist.includes(place.id)}
                  onToggleWishlist={toggleWishlist}
                  onView={(id) => navigate(`/places/${encodeURIComponent(id)}`)}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Static filter option lists (kept as before — UI-only for rating/hours/fee
// since Geoapify's free tier doesn't return those fields)
const distanceOptionsList = ["Under 2 km", "2–5 km", "5–10 km", "10+ km"];
const ratingOptionsList = ["4.5+ Excellent", "4.0+ Very Good", "3.5+ Good", "All ratings"];
const hoursOptionsList = ["Open now", "Open on weekends", "Open 24 hours"];
const feeOptionsList = ["Free entry", "Under ₹50", "₹50–₹200", "₹200+"];
const bestTimeOptionsList = ["Morning (6am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)", "Night (8pm+)"];
