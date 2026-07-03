import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { amenities, rooms, reviews, nearby, ratingBars } from "../data/hotelDetail.json";






export default function HotelDetail() {
  const navigate = useNavigate();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [checkIn, setCheckIn] = useState("2025-06-20");
  const [checkOut, setCheckOut] = useState("2025-06-22");

  const nights = 2;
  const basePrice = 2499;
  const subtotal = nights * basePrice;
  const taxes = 899;
  const total = subtotal + taxes;

  const Counter = ({ value, onInc, onDec, min = 0 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        onClick={onDec}
        disabled={value <= min}
        style={{
          width: "28px", height: "28px", borderRadius: "50%",
          border: "1.5px solid #E2E8F0", background: "#FFFFFF",
          fontSize: "16px", cursor: value <= min ? "not-allowed" : "pointer",
          color: value <= min ? "#CBD5E1" : "#1E293B",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >−</button>
      <span style={{ fontSize: "15px", fontWeight: "600", color: "#1E293B", minWidth: "20px", textAlign: "center" }}>{value}</span>
      <button
        onClick={onInc}
        style={{
          width: "28px", height: "28px", borderRadius: "50%",
          border: "1.5px solid #E2E8F0", background: "#FFFFFF",
          fontSize: "16px", cursor: "pointer", color: "#1E293B",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >+</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

      {/* Navbar */}
      <div style={{
        height: "72px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
        display: "flex", alignItems: "center", padding: "0 80px",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div onClick={() => navigate("/")} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "22px", fontWeight: "700", color: "#2563EB", cursor: "pointer" }}>YatraOne</div>
        <div style={{ display: "flex", gap: "32px" }}>
          {["Trains", "Hotels", "Places", "Map", "AI Itinerary"].map((item) => (
            <span key={item} style={{ fontSize: "14px", color: "#64748B", cursor: "pointer", fontWeight: "500" }}>{item}</span>
          ))}
        </div>
        <button style={{ background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Login</button>
      </div>

      {/* Breadcrumb */}
      <div style={{ height: "48px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 80px" }}>
        {["Home", "Hotels", "Jaipur", "Hotel Pearl Palace"].map((crumb, i, arr) => (
          <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: i === arr.length - 1 ? "#1E293B" : "#2563EB", fontWeight: i === arr.length - 1 ? "500" : "400", cursor: i < arr.length - 1 ? "pointer" : "default" }}>{crumb}</span>
            {i < arr.length - 1 && <span style={{ fontSize: "13px", color: "#94A3B8" }}>→</span>}
          </span>
        ))}
      </div>

      {/* Hotel Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "32px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "28px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Hotel Pearl Palace</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#F59E0B", fontSize: "16px" }}>★★★★</span>
              <span style={{ fontSize: "13px", color: "#64748B" }}>4 Star Hotel</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>📍</span>
              <span style={{ fontSize: "14px", color: "#64748B" }}>Near Jaipur Junction, Civil Lines, Jaipur</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#DCFCE7", borderRadius: "20px", padding: "4px 12px", width: "fit-content" }}>
              <span style={{ fontSize: "14px", color: "#166534", fontWeight: "600" }}>4.3 ★ Very Good</span>
              <span style={{ fontSize: "13px", color: "#166534" }}>· 428 reviews</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["✅ Free Cancellation", "🍳 Breakfast Included", "📶 Free WiFi"].map((b) => (
                <span key={b} style={{ border: "1px solid #DCFCE7", background: "#F0FDF4", color: "#166534", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", fontWeight: "500" }}>{b}</span>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#94A3B8" }}>Per night from</span>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "32px", fontWeight: "700", color: "#1E293B" }}>₹2,499</div>
            <div style={{ fontSize: "14px", color: "#94A3B8", textDecoration: "line-through" }}>₹3,200</div>
            <button onClick={() => window.open("https://www.makemytrip.com", "_blank")} style={{ background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "220px", appearance: "none", WebkitAppearance: "none" }}>Book on MakeMyTrip ↗</button>
            <button onClick={() => window.open("https://www.oyorooms.com", "_blank")} style={{ background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", width: "220px", appearance: "none", WebkitAppearance: "none" }}>View on OYO ↗</button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div style={{ padding: "32px 80px", background: "#F8FAFC" }}>
        <div style={{ display: "flex", gap: "8px", height: "400px" }}>
          <div style={{ width: "60%", background: "#D1D5DB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "48px" }}>🏨</span>
          </div>
          <div style={{ width: "40%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#D1D5DB", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: "24px" }}>🏨</span>
                {i === 3 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "500" }}>View all photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: "32px", padding: "0 80px 60px", alignItems: "flex-start" }}>

        {/* Left Column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* About */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>About this hotel</h2>
            <p style={{ fontSize: "15px", color: "#64748B", lineHeight: "1.7", margin: "0 0 20px 0" }}>
              Hotel Pearl Palace is a heritage-style boutique hotel located in the heart of Jaipur. Known for its royal Rajasthani architecture, rooftop restaurant with stunning views, and warm hospitality, it offers an authentic pink city experience at an affordable price.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                ["Year established", "2010"],
                ["Total rooms", "45"],
                ["Check in", "12:00 PM"],
                ["Check out", "11:00 AM"],
                ["Languages", "Hindi, English"],
                ["Property type", "Hotel"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#94A3B8" }}>{label}:</span>
                  <span style={{ fontSize: "14px", color: "#1E293B", fontWeight: "500" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>Amenities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {amenities.map((a) => (
                <div key={a.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{a.icon}</span>
                  <span style={{ fontSize: "14px", color: "#1E293B" }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>Available rooms</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {rooms.map((room) => (
                <div key={room.name} style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px", display: "flex", gap: "20px" }}>
                  <div style={{ width: "200px", height: "140px", background: "#E2E8F0", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "32px" }}>🛏️</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#1E293B" }}>{room.name}</span>
                    <span style={{ fontSize: "13px", color: "#64748B" }}>{room.size}</span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {room.chips.map((c) => (
                        <span key={c} style={{ border: "1px solid #E2E8F0", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", color: "#64748B" }}>{c}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ fontSize: "13px", color: "#166534" }}>✅ Free cancellation</span>
                      <span style={{ fontSize: "13px", color: "#166534" }}>🍳 Breakfast included</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px", fontWeight: "700", color: "#1E293B" }}>{room.price}<span style={{ fontSize: "13px", fontWeight: "400", color: "#64748B" }}>/night</span></span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => window.open("https://www.makemytrip.com", "_blank")} style={{ background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", appearance: "none", WebkitAppearance: "none" }}>MakeMyTrip ↗</button>
                        <button onClick={() => window.open("https://www.oyorooms.com", "_blank")} style={{ background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", appearance: "none", WebkitAppearance: "none" }}>OYO ↗</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>Location</h2>
            <div style={{ width: "100%", height: "240px", background: "#E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "40px" }}>🗺️</span>
            </div>
            <p style={{ fontSize: "14px", color: "#64748B", margin: "0 0 16px 0" }}>Near Jaipur Junction, Civil Lines, Jaipur, Rajasthan 302006</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {nearby.map((p) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{p.icon}</span>
                    <span style={{ fontSize: "14px", color: "#1E293B" }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: "13px", color: "#94A3B8" }}>{p.dist}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: "600", color: "#1E293B", margin: "0 0 20px 0" }}>Guest reviews</h2>
            {/* Rating Summary */}
            <div style={{ display: "flex", gap: "32px", marginBottom: "24px", padding: "20px", background: "#F8FAFC", borderRadius: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "48px", fontWeight: "700", color: "#1E293B", lineHeight: 1 }}>4.3</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#1E293B" }}>Very Good</span>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>Based on 428 reviews</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                {ratingBars.map((bar) => (
                  <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#64748B", width: "130px" }}>{bar.label}</span>
                    <div style={{ flex: 1, height: "6px", background: "#E2E8F0", borderRadius: "3px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "6px", width: `${bar.pct}%`, background: "#2563EB", borderRadius: "3px" }}></div>
                    </div>
                    <span style={{ fontSize: "13px", color: "#1E293B", fontWeight: "500", width: "32px" }}>{(bar.pct / 20).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Review Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {reviews.map((r) => (
                <div key={r.name} style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E40AF" }}>{r.initials}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>{r.name}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>{r.date}</div>
                    </div>
                    <span style={{ color: "#F59E0B", fontSize: "14px" }}>{"★".repeat(r.stars)}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6", margin: "0 0 12px 0" }}>{r.text}</p>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span style={{ fontSize: "13px", color: "#64748B" }}>Helpful?</span>
                    <span style={{ fontSize: "13px", color: "#2563EB", cursor: "pointer" }}>👍 Yes</span>
                    <span style={{ fontSize: "13px", color: "#64748B", cursor: "pointer" }}>👎 No</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <span style={{ fontSize: "14px", color: "#2563EB", fontWeight: "500", cursor: "pointer" }}>View all 428 reviews →</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: "360px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "88px" }}>

          {/* Booking Card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>Book this hotel</h3>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Check in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ width: "100%", height: "44px", border: "1.5px solid #E2E8F0", borderRadius: "8px", padding: "0 10px", fontSize: "13px", color: "#1E293B", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "#94A3B8", display: "block", marginBottom: "4px" }}>Check out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ width: "100%", height: "44px", border: "1.5px solid #E2E8F0", borderRadius: "8px", padding: "0 10px", fontSize: "13px", color: "#1E293B", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} />
              </div>
            </div>
            {[
              { label: "Adults", value: adults, onInc: () => setAdults(adults + 1), onDec: () => setAdults(Math.max(1, adults - 1)), min: 1 },
              { label: "Children", value: children, onInc: () => setChildren(children + 1), onDec: () => setChildren(Math.max(0, children - 1)) },
              { label: "Rooms", value: roomCount, onInc: () => setRoomCount(roomCount + 1), onDec: () => setRoomCount(Math.max(1, roomCount - 1)), min: 1 },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", color: "#1E293B" }}>{item.label}</span>
                <Counter value={item.value} onInc={item.onInc} onDec={item.onDec} min={item.min} />
              </div>
            ))}
            <div style={{ height: "1px", background: "#E2E8F0", margin: "16px 0" }}></div>
            {[
              { label: `${nights} nights × ₹${basePrice.toLocaleString()}`, value: `₹${subtotal.toLocaleString()}` },
              { label: "Taxes & fees", value: `₹${taxes.toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#64748B" }}>{row.label}</span>
                <span style={{ fontSize: "14px", color: "#1E293B" }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #E2E8F0", marginBottom: "16px" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B" }}>Total</span>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B" }}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={() => window.open("https://www.makemytrip.com", "_blank")} style={{ width: "100%", height: "48px", background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", marginBottom: "10px", appearance: "none", WebkitAppearance: "none" }}>Book on MakeMyTrip ↗</button>
            <button onClick={() => window.open("https://www.oyorooms.com", "_blank")} style={{ width: "100%", height: "48px", background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", marginBottom: "10px", appearance: "none", WebkitAppearance: "none" }}>Book on OYO ↗</button>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <span onClick={() => window.open("https://www.goibibo.com", "_blank")} style={{ fontSize: "14px", color: "#2563EB", cursor: "pointer", fontWeight: "500" }}>Book on Goibibo ↗</span>
            </div>
            <p style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center", margin: 0 }}>You will be redirected to complete booking</p>
          </div>

          {/* Check Availability */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: "600", color: "#1E293B", margin: "0 0 12px 0" }}>Check availability</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px", background: "#EFF6FF", borderRadius: "8px" }}>
              <span style={{ fontSize: "20px" }}>📅</span>
              <span style={{ fontSize: "13px", color: "#64748B" }}>Select your dates to see room availability</span>
            </div>
          </div>

          {/* Similar Hotels */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: "600", color: "#1E293B", margin: "0 0 16px 0" }}>Similar hotels nearby</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "Jai Mahal Palace", stars: 5, price: "₹8,500" },
                { name: "Hotel Diggi Palace", stars: 3, price: "₹1,899" },
                { name: "Samode Haveli", stars: 4, price: "₹4,200" },
              ].map((h) => (
                <div key={h.name} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{ width: "48px", height: "48px", background: "#E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "20px" }}>🏨</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B" }}>{h.name}</div>
                    <div style={{ fontSize: "12px", color: "#F59E0B" }}>{"★".repeat(h.stars)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>{h.price}</span>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>/night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}