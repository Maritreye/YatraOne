import { useState } from "react";
import trains from "../data/trains.json";
import { useNavigate, useLocation } from 'react-router-dom';

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function TrainSearch() {
  const navigate = useNavigate();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedClassOnCard, setSelectedClassOnCard] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortBy, setSortBy] = useState("Departure");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const location = useLocation();
  const searchState = location.state || {};
  const fromLabel = searchState.from || 'Varanasi Jn';
  const toLabel = searchState.to || 'Jaipur Jn';
  const dateLabel = searchState.date ? new Date(searchState.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '20 Jun 2025';
  const toggleItem = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const clearAll = () => {
    setSelectedTimes([]);
    setSelectedClasses([]);
    setSelectedAvailability([]);
    setSelectedDays([]);
  };

  const getAvailabilityStyle = (status) => {
    if (status === "Available") return { bg: "#DCFCE7", color: "#166534" };
    if (status === "Waitlist") return { bg: "#FEF9C3", color: "#854D0E" };
    return { bg: "#FEE2E2", color: "#991B1B" };
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

      {/* Navbar */}
      <div style={{
        height: "72px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        padding: "0 80px",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div
          onClick={() => navigate("/")}
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: "22px", fontWeight: "700", color: "#2563EB", cursor: "pointer" }}
        >
          YatraOne
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {["Trains", "Hotels", "Places", "Map", "AI Itinerary"].map((item) => (
            <span key={item} style={{ fontSize: "14px", color: "#64748B", cursor: "pointer", fontWeight: "500" }}>{item}</span>
          ))}
        </div>
        <button
          style={{
            background: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Login
        </button>
      </div>

      {/* Search Summary Bar */}
      <div style={{
        background: "#EFF6FF",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 80px",
        borderBottom: "1px solid #DBEAFE",
      }}>
        <span style={{ fontSize: "15px", fontWeight: "500", color: "#1E293B" }}>
        🚆 {fromLabel} → {toLabel} &nbsp;·&nbsp; {dateLabel} &nbsp;·&nbsp; 1 Passenger
        </span>
        <button style={{
          border: "1.5px solid #2563EB",
          background: "transparent",
          color: "#2563EB",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}>
          Edit Search
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", padding: "24px 80px", gap: "32px", alignItems: "flex-start" }}>

        {/* Filter Sidebar */}
        <div style={{ width: "280px", flexShrink: 0 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#1E293B" }}>Filters</span>
            <span onClick={clearAll} style={{ fontSize: "14px", color: "#2563EB", cursor: "pointer" }}>Clear all</span>
          </div>

          <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "20px" }}></div>

          {/* Departure Time */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B", margin: "0 0 12px 0" }}>Departure Time</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggleItem(selectedTimes, setSelectedTimes, t)}
                  style={{
                    border: `1.5px solid ${selectedTimes.includes(t) ? "#2563EB" : "#E2E8F0"}`,
                    background: selectedTimes.includes(t) ? "#EFF6FF" : "#FFFFFF",
                    color: selectedTimes.includes(t) ? "#2563EB" : "#64748B",
                    borderRadius: "20px",
                    padding: "8px 0",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: "500",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "20px" }}></div>

          {/* Train Class */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B", margin: "0 0 12px 0" }}>Train Class</p>
            {[["Sleeper (SL)", "SL"], ["AC 3 Tier (3A)", "3A"], ["AC 2 Tier (2A)", "2A"], ["First Class (1A)", "1A"]].map(([label, val]) => (
              <div
                key={val}
                onClick={() => toggleItem(selectedClasses, setSelectedClasses, val)}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer" }}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: `1.5px solid ${selectedClasses.includes(val) ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: "4px",
                  background: selectedClasses.includes(val) ? "#2563EB" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {selectedClasses.includes(val) && <span style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontSize: "14px", color: "#64748B" }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "20px" }}></div>

          {/* Duration Slider */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B", margin: "0 0 12px 0" }}>Duration</p>
            <input
              type="range"
              min="2"
              max="18"
              defaultValue="18"
              style={{ width: "100%", accentColor: "#2563EB" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>2h</span>
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>18h</span>
            </div>
          </div>

          <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "20px" }}></div>

          {/* Availability */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B", margin: "0 0 12px 0" }}>Availability</p>
            {["Available", "Waitlist"].map((val) => (
              <div
                key={val}
                onClick={() => toggleItem(selectedAvailability, setSelectedAvailability, val)}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer" }}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: `1.5px solid ${selectedAvailability.includes(val) ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: "4px",
                  background: selectedAvailability.includes(val) ? "#2563EB" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {selectedAvailability.includes(val) && <span style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontSize: "14px", color: "#64748B" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "#E2E8F0", marginBottom: "20px" }}></div>

          {/* Days */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#1E293B", margin: "0 0 12px 0" }}>Days</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {dayLabels.map((d, i) => (
                <div
                  key={i}
                  onClick={() => toggleItem(selectedDays, setSelectedDays, i)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: selectedDays.includes(i) ? "#2563EB" : "#F1F5F9",
                    color: selectedDays.includes(i) ? "#FFFFFF" : "#64748B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Train Results */}
        <div style={{ flex: 1 }}>

          {/* Results Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "15px", fontWeight: "500", color: "#1E293B" }}>24 trains found</span>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  border: "1.5px solid #E2E8F0",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "14px",
                  color: "#1E293B",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Sort by: {sortBy} ▾
              </button>
              {showSortDropdown && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 50,
                  minWidth: "220px",
                  overflow: "hidden",
                }}>
                  {["Departure", "Arrival", "Duration", "Price"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: sortBy === opt ? "#2563EB" : "#1E293B",
                        background: sortBy === opt ? "#EFF6FF" : "#FFFFFF",
                        cursor: "pointer",
                        fontWeight: sortBy === opt ? "500" : "400",
                      }}
                    >
                      {opt === "Departure" ? "Departure time (earliest first)" :
                       opt === "Arrival" ? "Arrival time (earliest first)" :
                       opt === "Duration" ? "Duration (shortest first)" :
                       "Price (lowest first)"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Train Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {trains.map((train) => {
              const avStyle = getAvailabilityStyle(train.availability);
              const isExpanded = expandedCard === train.id;
              const selectedClass = selectedClassOnCard[train.id] || train.classes[0].name;

              return (
                <div
                  key={train.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  {/* Row 1 — Train name */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#1E293B" }}>{train.name}</span>
                      <span style={{ fontSize: "13px", color: "#94A3B8" }}>#{train.number}</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {dayLabels.map((d, i) => (
                        <div
                          key={i}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: train.days[i] ? "#1E293B" : "#F1F5F9",
                            color: train.days[i] ? "#FFFFFF" : "#94A3B8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "500",
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2 — Timing */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ minWidth: "120px" }}>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "24px", fontWeight: "700", color: "#1E293B" }}>{train.departure}</div>
                      <div style={{ fontSize: "13px", color: "#64748B" }}>{train.from}</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px" }}>
                      <span style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "6px" }}>{train.duration}</span>
                      <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "4px" }}>
                        <div style={{ flex: 1, height: "1.5px", background: "#E2E8F0" }}></div>
                        <span style={{ fontSize: "14px", color: "#94A3B8" }}>✈</span>
                        <div style={{ flex: 1, height: "1.5px", background: "#E2E8F0" }}></div>
                      </div>
                    </div>
                    <div style={{ minWidth: "120px", textAlign: "right" }}>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "24px", fontWeight: "700", color: "#1E293B" }}>{train.arrival}</div>
                      <div style={{ fontSize: "13px", color: "#64748B" }}>{train.to}</div>
                    </div>
                  </div>

                  {/* Row 3 — Class pills */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                    {train.classes.map((cls) => (
                      <button
                        key={cls.name}
                        onClick={() => setSelectedClassOnCard((prev) => ({ ...prev, [train.id]: cls.name }))}
                        style={{
                          border: `1.5px solid ${selectedClass === cls.name ? "#2563EB" : "#E2E8F0"}`,
                          background: selectedClass === cls.name ? "#EFF6FF" : "#FFFFFF",
                          color: selectedClass === cls.name ? "#2563EB" : "#64748B",
                          borderRadius: "20px",
                          padding: "6px 14px",
                          fontSize: "13px",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: "500",
                        }}
                      >
                        {cls.name} {cls.price}
                      </button>
                    ))}
                  </div>

                  {/* Row 4 — Bottom actions */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    <span style={{
                      background: avStyle.bg,
                      color: avStyle.color,
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}>
                      {train.availability}
                    </span>
                    <span
                      onClick={() => setExpandedCard(isExpanded ? null : train.id)}
                      style={{ fontSize: "13px", color: "#2563EB", cursor: "pointer", fontWeight: "500" }}
                    >
                      {isExpanded ? "Hide stops ▲" : "View stops ▼"}
                    </span>
                    <button
                      onClick={() => window.open("https://www.irctc.co.in", "_blank")}
                      style={{
                        background: "#2563EB",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        appearance: "none",
                        WebkitAppearance: "none",
                      }}
                    >
                      Book on IRCTC ↗
                    </button>
                  </div>

                  {/* Expandable Stops */}
                  {isExpanded && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {train.stops.map((stop, idx) => {
                          const parts = stop.split(" ");
                          const time = parts[parts.length - 1];
                          const station = parts.slice(0, -1).join(" ");
                          return (
                            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  background: "#2563EB",
                                  border: "2px solid #BFDBFE",
                                  flexShrink: 0,
                                  marginTop: "4px",
                                }}></div>
                                {idx < train.stops.length - 1 && (
                                  <div style={{ width: "2px", height: "32px", background: "#E2E8F0" }}></div>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: "16px", paddingBottom: idx < train.stops.length - 1 ? "8px" : "0" }}>
                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B", minWidth: "50px" }}>{time}</span>
                                <span style={{ fontSize: "13px", color: "#64748B" }}>{station}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}