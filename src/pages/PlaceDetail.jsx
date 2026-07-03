import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import placeholderLandmark from "../assets/placeholders/placeholder-landmark.svg";
import placeholderMarket from "../assets/placeholders/placeholder-market.svg";
import placeholderNature from "../assets/placeholders/placeholder-nature.svg";

// Deliberately using generic doodle illustrations instead of real stock
// photos of famous landmarks (e.g. Taj Mahal) — showing a real photo of
// a specific place next to an unrelated POI's name would be misleading.
const PLACEHOLDER_IMAGES = [placeholderLandmark, placeholderMarket, placeholderNature];

function StarRow({ rating, size = "14px" }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: size }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

// Geoapify's Place Details endpoint returns a GeoJSON FeatureCollection,
// NOT a flat object — the actual data lives inside
// data.features[].properties, on the feature whose feature_type is "details".
// This was the bug causing "Unnamed Place" / "attraction" to show for every place.
function normalizeDetail(data) {
  const detailsFeature =
    (data.features || []).find((f) => f.properties?.feature_type === "details") ||
    (data.features || [])[0];
  const p = detailsFeature?.properties || {};

  // wiki_and_media.image is a REAL image when OSM/Wikidata has one for this
  // place — fall back to placeholders only when it's missing.
  const realImage = p.wiki_and_media?.image;
  const images = realImage
    ? [realImage, ...PLACEHOLDER_IMAGES.slice(0, 2)]
    : PLACEHOLDER_IMAGES;

  return {
    name: p.name || p.address_line1 || "Unnamed Place",
    category: (p.categories && p.categories[0]) || "attraction",
    images,
    rating: 4.3, // placeholder — not available on free tier
    reviews: 0, // placeholder
    location: p.address_line2 || "",
    city: p.city || p.formatted || "Jaipur",
    description:
      p.description ||
      p.formatted ||
      "Details for this place are limited on the free data tier, but it's a recognized point of interest in the area.",
    highlights: [
      "Notable local landmark",
      "Good photo opportunity",
      "Accessible by local transport",
    ], // placeholder — not available on free tier
    reviewsList: [], // placeholder — no review data available
    hours: p.opening_hours || "Hours not listed",
    fee: "Check on arrival", // placeholder — not returned by this API
    bestTime: "Morning", // placeholder
    distance: "—",
    lat: p.lat,
    lon: p.lon,
    place_id: p.place_id,
  };
}

export default function PlaceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nearby, setNearby] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/places/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Failed to load place");
        const data = await res.json();
        setPlace(normalizeDetail(data));
      } catch (err) {
        setError("Couldn't load this place right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Fetch real nearby places once we know this place's coordinates,
  // only when the Nearby tab is opened (saves API calls).
  useEffect(() => {
    if (activeTab !== "Nearby" || !place?.lat || !place?.lon || nearby.length > 0) return;
    const fetchNearby = async () => {
      setNearbyLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/places?lat=${place.lat}&lon=${place.lon}&radius=3000&category=tourism.sights&excludeId=${encodeURIComponent(place.place_id)}`
        );
        const data = await res.json();
        setNearby(data.slice(0, 5));
      } catch (err) {
        setNearby([]);
      } finally {
        setNearbyLoading(false);
      }
    };
    fetchNearby();
  }, [activeTab, place, nearby.length]);

  if (loading) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#64748B" }}>Loading place...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#EF4444" }}>{error || "Place not found"}</div>
        <div
          onClick={() => navigate("/places")}
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#2563EB", cursor: "pointer" }}
        >
          ← Back to Places
        </div>
      </div>
    );
  }

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

      {/* Breadcrumb */}
      <div style={{ padding: "20px 80px 0 80px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>
          <span onClick={() => navigate("/places")} style={{ cursor: "pointer", color: "#2563EB" }}>
            Places
          </span>{" "}
          / {place.name}
        </div>
      </div>

      {/* Hero Image */}
      <div style={{ padding: "16px 80px 0 80px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "12px", height: "360px" }}>
          <div
            style={{
              flex: 2,
              backgroundColor: "#D1D5DB",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={place.images[0]}
              alt={place.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ flex: 1, backgroundColor: "#D1D5DB", borderRadius: "12px", overflow: "hidden" }}>
              <img
                src={place.images[1]}
                alt={`${place.name} 2`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ flex: 1, backgroundColor: "#D1D5DB", borderRadius: "12px", overflow: "hidden" }}>
              <img
                src={place.images[2]}
                alt={`${place.name} 3`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          padding: "32px 80px",
          boxSizing: "border-box",
          alignItems: "flex-start",
        }}
      >
        {/* Left column */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Title row */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: "#FFFFFF",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {place.category}
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "30px", color: "#1E293B" }}>
                  {place.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <StarRow rating={place.rating} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                    {place.rating}
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#94A3B8" }}>
                    ({place.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B", marginTop: "6px" }}>
                  📍 {place.location} · {place.city}
                </div>
              </div>
              <div
                onClick={() => setSaved(!saved)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: saved ? "#FEE2E2" : "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: saved ? "#EF4444" : "#64748B",
                  flexShrink: 0,
                }}
              >
                {saved ? "♥" : "♡"}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #E2E8F0" }}>
            {["Overview", "Highlights", "Reviews", "Nearby"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  paddingBottom: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "#2563EB" : "#64748B",
                  borderBottom: activeTab === tab ? "2px solid #2563EB" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Overview" && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#475569", lineHeight: "1.7" }}>
              {place.description}
            </div>
          )}

          {activeTab === "Highlights" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {place.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#2563EB", fontSize: "16px" }}>✓</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#475569" }}>{h}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {place.reviewsList.length === 0 ? (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B" }}>
                  No reviews yet for this place.
                </div>
              ) : (
                place.reviewsList.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                        {r.name}
                      </span>
                      <StarRow rating={r.rating} size="13px" />
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B" }}>{r.text}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Nearby" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {nearbyLoading && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B" }}>
                  Loading nearby places...
                </div>
              )}
              {!nearbyLoading && nearby.length === 0 && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B" }}>
                  No nearby places found.
                </div>
              )}
              {nearby.map((feature, i) => {
                const p = feature.properties || {};
                return (
                  <div
                    key={p.place_id || i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "8px", overflow: "hidden" }}>
                        <img
                          src={PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                          {p.name || "Unnamed place"}
                        </div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B" }}>
                          {p.distance ? `${(p.distance / 1000).toFixed(1)} km away` : ""}
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => navigate(`/places/${encodeURIComponent(p.place_id)}`)}
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#2563EB", cursor: "pointer" }}
                    >
                      View →
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column - Info card */}
        <div
          style={{
            flex: 1,
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "20px",
          }}
        >
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", color: "#1E293B" }}>
            Visit Information
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>Opening hours</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1E293B", fontWeight: 500 }}>
                {place.hours}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>Entry fee</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1E293B", fontWeight: 500 }}>
                {place.fee}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>Best time</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1E293B", fontWeight: 500 }}>
                {place.bestTime}
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate("/map")}
            style={{
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            View on Map
          </div>

          <div
            onClick={() => navigate("/itinerary")}
            style={{
              backgroundColor: "#0F766E",
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Add to Itinerary +
          </div>
        </div>
      </div>
    </div>
  );
}
