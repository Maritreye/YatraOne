import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const CATEGORY_FILTERS = ["All", "Train Stations", "Hotels", "Tourist Places", "Restaurants", "Shopping"];

const CATEGORY_STYLE = {
  Station:    { bg: "#DBEAFE", icon: "#1E40AF", pin: "#1E40AF", symbol: "🚉" },
  Hotel:      { bg: "#CCFBF1", icon: "#0F766E", pin: "#0F766E", symbol: "🛏️" },
  Place:      { bg: "#FEF9C3", icon: "#854D0E", pin: "#D97706", symbol: "🏛️" },
  Restaurant: { bg: "#FEE2E2", icon: "#991B1B", pin: "#BE123C", symbol: "🍴" },
  Shopping:   { bg: "#EDE9FE", icon: "#5B21B6", pin: "#5B21B6", symbol: "🛍️" },
};

function StarRow({ rating, size = "12px" }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: size }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function MapView() {
  const navigate = useNavigate();
  const mapRef = useRef(null);       // DOM node for Leaflet to mount into
  const leafletMap = useRef(null);   // Leaflet map instance
  const markersRef = useRef([]);     // Track all markers for cleanup

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapType, setMapType] = useState("Map");
  const [showStations, setShowStations] = useState(true);
  const [showHotels, setShowHotels] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);

  // City + live Geoapify data
  const [city, setCity] = useState("Jaipur");
  const [cityInputOpen, setCityInputOpen] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [cityCenter, setCityCenter] = useState([26.9124, 75.7873]);
  const [livePins, setLivePins] = useState([]);

  const visiblePins = livePins.filter((p) => {
    if (activeFilter !== "All" && p.category !== activeFilter) return false;
    if (!showStations && p.type === "Station") return false;
    if (!showHotels && p.type === "Hotel") return false;
    if (!showPlaces && p.type === "Place") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = livePins.find((p) => p.id === selectedPin);

  // ── Map Geoapify category codes to our internal type labels ──────────────
  const CATEGORY_FROM_GEOAPIFY = (cats = []) => {
    if (cats.some((c) => c.startsWith("accommodation"))) return "Hotel";
    if (cats.some((c) => c.startsWith("catering"))) return "Restaurant";
    if (cats.some((c) => c.startsWith("commercial"))) return "Shopping";
    if (cats.some((c) => c.startsWith("tourism"))) return "Place";
    return "Place";
  };

  // ── Geocode a city name, then fetch nearby places, then update state ─────
  const loadCity = async (cityName) => {
    try {
      const geoRes = await fetch(
        `http://localhost:5000/api/geo/geocode?city=${encodeURIComponent(cityName)}`
      );
      const geoData = await geoRes.json();
      const feature = geoData.features?.[0];
      if (!feature) return; // TODO: could show a "city not found" message here

      const [lon, lat] = feature.geometry.coordinates;
      setCityCenter([lat, lon]);
      setCity(feature.properties.city || feature.properties.name || cityName);

      const placesRes = await fetch(
        `http://localhost:5000/api/geo/places?lat=${lat}&lon=${lon}`
      );
      const placesData = await placesRes.json();

      const mapped = (placesData.features || []).map((f, i) => ({
        id: f.properties.place_id || `p-${i}`,
        name: f.properties.name || f.properties.address_line1 || "Unnamed",
        type: CATEGORY_FROM_GEOAPIFY(f.properties.categories),
        category: CATEGORY_FROM_GEOAPIFY(f.properties.categories),
        address: f.properties.formatted || "",
        distance: f.properties.distance
          ? `${(f.properties.distance / 1000).toFixed(1)} km`
          : "",
        rating: 4.0, // Geoapify free tier doesn't return ratings
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));

      setLivePins(mapped);
      leafletMap.current?.map.setView([lat, lon], 13);
    } catch (err) {
      console.error("City load failed:", err);
    }
  };

  // Initial city load on mount
  useEffect(() => {
    loadCity("Jaipur");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Initialize Leaflet once ──────────────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current || !mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix Leaflet's broken default icon paths in Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: cityCenter,
        zoom: 13,
        zoomControl: false, // we render our own zoom UI
      });

      // Tile layer — switches between Map and Satellite
      const streetTile = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "© OpenStreetMap contributors", maxZoom: 19 }
      ).addTo(map);

      const satelliteTile = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© Esri", maxZoom: 19 }
      );

      leafletMap.current = { map, streetTile, satelliteTile, L };
    });

    return () => {
      if (leafletMap.current?.map) {
        leafletMap.current.map.remove();
        leafletMap.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Redraw markers when visiblePins or selectedPin changes ───────────────
  useEffect(() => {
    if (!leafletMap.current) return;
    const { map, L } = leafletMap.current;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    visiblePins.forEach((pin) => {
      const style = CATEGORY_STYLE[pin.type] || CATEGORY_STYLE["Place"];
      const isSelected = pin.id === selectedPin;
      const size = isSelected ? 48 : 36;

      const icon = L.divIcon({
        html: pin.price
          ? `<div style="
              background:${isSelected ? "#2563EB" : "#FFFFFF"};
              color:${isSelected ? "#FFFFFF" : "#1E293B"};
              border:${isSelected ? "none" : "1px solid #E2E8F0"};
              border-radius:20px;
              padding:6px 12px;
              font-family:Inter,sans-serif;
              font-weight:500;
              font-size:13px;
              white-space:nowrap;
              box-shadow:0 1px 4px rgba(0,0,0,0.15);
              cursor:pointer;">${pin.price}</div>`
          : `<div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${style.pin};
              border:${isSelected ? "3px solid #FFFFFF" : "2px solid #FFFFFF"};
              outline:${isSelected ? `1px solid ${style.pin}` : "none"};
              display:flex;align-items:center;justify-content:center;
              font-size:${isSelected ? "20px" : "16px"};
              box-shadow:0 1px 4px rgba(0,0,0,0.25);
              cursor:pointer;
              transition:all 0.15s ease;">${style.symbol}</div>`,
        className: "",
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .on("click", () => setSelectedPin(pin.id));

      markersRef.current.push(marker);
    });
  }, [visiblePins, selectedPin]);

  // ── Switch tile layer when mapType changes ───────────────────────────────
  useEffect(() => {
    if (!leafletMap.current) return;
    const { map, streetTile, satelliteTile } = leafletMap.current;
    if (mapType === "Map") {
      if (!map.hasLayer(streetTile)) map.addLayer(streetTile);
      if (map.hasLayer(satelliteTile)) map.removeLayer(satelliteTile);
    } else {
      if (!map.hasLayer(satelliteTile)) map.addLayer(satelliteTile);
      if (map.hasLayer(streetTile)) map.removeLayer(streetTile);
    }
  }, [mapType]);

  // ── Zoom controls ────────────────────────────────────────────────────────
  const zoomIn  = () => leafletMap.current?.map.zoomIn();
  const zoomOut = () => leafletMap.current?.map.zoomOut();
  const recenter = () => leafletMap.current?.map.setView(cityCenter, 13);

  // ── Pan to selected pin ──────────────────────────────────────────────────
  useEffect(() => {
    if (!leafletMap.current || !selected) return;
    leafletMap.current.map.panTo([selected.lat, selected.lng]);
  }, [selected]);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ width: "100%", height: "60px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", boxSizing: "border-box", flexShrink: 0 }}>
        <div onClick={() => navigate("/")} style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "20px", color: "#2563EB", cursor: "pointer" }}>
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
            <div key={item.label} onClick={() => navigate(item.path)} style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: item.label === "Map" ? "#2563EB" : "#475569", fontWeight: item.label === "Map" ? 600 : 400, cursor: "pointer" }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
        <div style={{ width: "380px", flexShrink: 0, backgroundColor: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #E2E8F0" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places, hotels, stations..."
              style={{ width: "100%", height: "44px", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "0 14px", fontFamily: "Inter, sans-serif", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto" }}>
              {CATEGORY_FILTERS.map((cat) => (
                <div key={cat} onClick={() => setActiveFilter(cat)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: "20px", border: activeFilter === cat ? "none" : "1px solid #E2E8F0", backgroundColor: activeFilter === cat ? "#2563EB" : "#FFFFFF", color: activeFilter === cat ? "#FFFFFF" : "#64748B", fontFamily: "Inter, sans-serif", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 8px 16px" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>{visiblePins.length} places near {city}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B", cursor: "pointer" }}>Sort ↕</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {visiblePins.map((pin) => {
              const style = CATEGORY_STYLE[pin.type] || CATEGORY_STYLE["Place"];
              const isSelected = selectedPin === pin.id;
              return (
                <div key={pin.id} onClick={() => setSelectedPin(pin.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "0.5px solid #E2E8F0", borderLeft: isSelected ? "3px solid #2563EB" : "3px solid transparent", backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF", cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: style.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {style.symbol}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pin.name}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#94A3B8" }}>{pin.category} · {pin.distance}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <StarRow rating={pin.rating} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B" }}>{pin.rating}</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pin.address}</div>
                  </div>
                  <span style={{ color: "#94A3B8", fontSize: "16px", flexShrink: 0 }}>›</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Area — real Leaflet */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Leaflet mounts here */}
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

          {/* Floating top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box", zIndex: 500 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "16px", color: "#1E293B" }}>Exploring {city}</span>
              {cityInputOpen ? (
                <input
                  autoFocus
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && cityInput.trim()) {
                      loadCity(cityInput.trim());
                      setCityInputOpen(false);
                      setCityInput("");
                    }
                  }}
                  onBlur={() => setCityInputOpen(false)}
                  placeholder="Type a city and press Enter"
                  style={{ height: "28px", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0 8px", fontFamily: "Inter, sans-serif", fontSize: "13px", outline: "none" }}
                />
              ) : (
                <span
                  onClick={() => setCityInputOpen(true)}
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#2563EB", cursor: "pointer" }}
                >
                  Change city
                </span>
              )}
            </div>
            <input placeholder="Search destination..." style={{ width: "320px", height: "36px", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "0 12px", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "Stations", icon: "🚉", active: showStations, toggle: () => setShowStations(!showStations) },
                { label: "Hotels",   icon: "🛏️", active: showHotels,   toggle: () => setShowHotels(!showHotels) },
                { label: "Places",   icon: "🏛️", active: showPlaces,   toggle: () => setShowPlaces(!showPlaces) },
              ].map((t) => (
                <div key={t.label} onClick={t.toggle} style={{ height: "36px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", borderRadius: "8px", border: t.active ? "none" : "1px solid #E2E8F0", backgroundColor: t.active ? "#2563EB" : "#FFFFFF", color: t.active ? "#FFFFFF" : "#475569", fontFamily: "Inter, sans-serif", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <span>{t.icon}</span> {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Map type toggle */}
          <div style={{ position: "absolute", top: "72px", left: "16px", display: "flex", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden", zIndex: 500 }}>
            {["Map", "Satellite"].map((t) => (
              <div key={t} onClick={() => setMapType(t)} style={{ padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: "13px", backgroundColor: mapType === t ? "#2563EB" : "#FFFFFF", color: mapType === t ? "#FFFFFF" : "#475569", cursor: "pointer" }}>
                {t}
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div style={{ position: "absolute", top: "72px", right: "16px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 500 }}>
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
              <div onClick={zoomIn}  style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#1E293B", cursor: "pointer" }}>+</div>
              <div style={{ height: "0.5px", backgroundColor: "#E2E8F0" }} />
              <div onClick={zoomOut} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#1E293B", cursor: "pointer" }}>−</div>
            </div>
            <div onClick={recenter} style={{ width: "40px", height: "40px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#2563EB", cursor: "pointer" }}>◎</div>
          </div>

          {/* Popup card */}
          {selected && (
            <div style={{ position: "absolute", top: "120px", left: "50%", transform: "translateX(-50%)", width: "280px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", zIndex: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
              <div style={{ position: "relative", width: "100%", height: "160px", backgroundColor: "#D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                {CATEGORY_STYLE[selected.type]?.symbol}
                <div onClick={() => setSelectedPin(null)} style={{ position: "absolute", top: "8px", right: "8px", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#475569", cursor: "pointer" }}>×</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#1E293B" }}>{selected.name}</div>
                <div style={{ alignSelf: "flex-start", backgroundColor: CATEGORY_STYLE[selected.type]?.bg, color: CATEGORY_STYLE[selected.type]?.icon, fontFamily: "Inter, sans-serif", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{selected.category}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <StarRow rating={selected.rating} size="13px" />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1E293B" }}>{selected.rating}</span>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>{selected.address}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#94A3B8" }}>{selected.distance} away</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <div onClick={() => navigate("/places")} style={{ flex: 1, textAlign: "center", border: "1px solid #2563EB", color: "#2563EB", fontFamily: "Inter, sans-serif", fontSize: "13px", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>View Details →</div>
                  <div style={{ flex: 1, textAlign: "center", backgroundColor: "#0F766E", color: "#FFFFFF", fontFamily: "Inter, sans-serif", fontSize: "13px", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>Get Directions ↗</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom info strip */}
          {selected && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", borderRadius: "12px 12px 0 0", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 500, boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#1E293B" }}>{selected.name}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>{selected.category} · ★ {selected.rating}</div>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>{selected.distance} away</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div onClick={() => navigate("/places")} style={{ border: "1px solid #2563EB", color: "#2563EB", fontFamily: "Inter, sans-serif", fontSize: "13px", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>View Details</div>
                <div style={{ backgroundColor: "#0F766E", color: "#FFFFFF", fontFamily: "Inter, sans-serif", fontSize: "13px", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Directions</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}