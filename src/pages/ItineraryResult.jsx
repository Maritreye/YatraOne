import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ItineraryResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const { mongoUser } = useAuth();
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

const handleSaveTrip = async () => {
  if (!mongoUser?._id) {
    alert("Please log in to save trips.");
    return;
  }
  setSaving(true);
  try {
    const res = await fetch("http://localhost:5000/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: mongoUser._id,
        itineraryId: id,
        destination: itinerary.destination,
        dates: `${itinerary.days?.[0]?.date || ""} – ${itinerary.days?.[itinerary.days.length - 1]?.date || ""}`,
        duration: itinerary.stats?.[0] || "",
        travellers: itinerary.preferences?.travellerType || "Solo",
        budget: `₹${(itinerary.preferences?.budget || 0).toLocaleString()}`,
        status: "Upcoming",
        trainStatus: "pending",
        hotelStatus: "pending",
        placesCount: itinerary.days?.reduce((acc, d) => acc + (d.activities?.filter(a => a.type === "Place").length || 0), 0) || 0,
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=320&fit=crop",
      }),
    });
    if (!res.ok) throw new Error("Save failed");
    setSaved(true);
    setTimeout(() => navigate("/saved"), 800);
  } catch (err) {
    console.error("Save trip error:", err);
    alert("Failed to save trip. Please try again.");
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/itineraries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItinerary(data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Failed to load itinerary:", err);
        setLoadingData(false);
      });
  }, [id]);

  const openIRCTC = () => {
    window.open(
      "https://www.irctc.co.in/nget/train-search",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openMakeMyTrip = () => {
    window.open(
      "https://www.makemytrip.com/hotels/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const badgeColors = {
    Train:      { bg: "#DBEAFE", text: "#1E40AF" },
    Hotel:      { bg: "#CCFBF1", text: "#0F766E" },
    Place:      { bg: "#FEF9C3", text: "#854D0E" },
    Restaurant: { bg: "#FEE2E2", text: "#991B1B" },
    Shopping:   { bg: "#EDE9FE", text: "#5B21B6" },
    Travel:     { bg: "#F1F5F9", text: "#475569" },
  };

  const dotColors = {
    Train:      "#1E40AF",
    Hotel:      "#0F766E",
    Place:      "#D97706",
    Restaurant: "#BE123C",
    Travel:     "#94A3B8",
    Shopping:   "#5B21B6",
  };

  if (loadingData) return <p style={{ padding: 40 }}>Loading itinerary...</p>;
  if (!itinerary)  return <p style={{ padding: 40 }}>Itinerary not found.</p>;

  const stats       = itinerary.stats       || [];
  const expenses    = itinerary.expenses    || [];
  const days        = itinerary.days        || [];
  const weatherTrip = itinerary.weatherTrip || [];
  const tips        = itinerary.tips        || [];
  const destination = itinerary.destination || "Your Destination";
  const preferences = itinerary.preferences || {};
  const totalExpense   = expenses.reduce((a, b) => a + (b.amount || 0), 0);
  const budgetRemaining = (preferences.budget || 0) - totalExpense;
  const numDays      = stats[0] || "";
  const placesCount  = stats[3] || "";

  // ── Resolve trainInfo ──────────────────────────────────────────────────────
  // Use top-level trainInfo first; if missing, extract from Day 1 activities
  const rawTrain = itinerary.trainInfo || null;
  const resolvedTrain = rawTrain || (() => {
    for (const day of days) {
      const trainAct = (day.activities || []).find((a) => a.type === "Train");
      if (trainAct) {
        return {
          name: trainAct.name || "See day 1 activities",
          departure: trainAct.desc || trainAct.name || "",
          class: "Sleeper (SL)",
          pricePerPerson: null,
          returnDeparture: null,
          extractedFromActivities: true,
        };
      }
    }
    return null;
  })();

  // ── Hotel ──────────────────────────────────────────────────────────────────
  const hotel       = itinerary.hotelInfo   || null;
  const hotelNights = hotel?.nights         ?? 1;
  const hotelRooms  = hotel?.rooms          ?? 1;
  const hotelPPN    = hotel?.pricePerNight  != null ? Number(hotel.pricePerNight) : null;
  const hotelTotal  = hotelPPN != null ? hotelPPN * hotelNights * hotelRooms : null;

  const styles = {
    page: {
      backgroundColor: "#F8FAFC",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
    },
    header: {
      width: "100%",
      minHeight: 220,
      backgroundColor: "#1E293B",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 80px",
      gap: 12,
    },
    headerTitle: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 36,
      color: "#FFFFFF",
      margin: 0,
      textAlign: "center",
    },
    headerSubtext: {
      fontSize: 16,
      color: "rgba(255,255,255,0.7)",
      margin: 0,
      textAlign: "center",
    },
    statBadgeRow: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 4,
    },
    statBadge: {
      backgroundColor: "#FFFFFF",
      color: "#1E293B",
      fontSize: 13,
      fontWeight: 500,
      padding: "6px 16px",
      borderRadius: 20,
    },
    actionButtonsRow: {
      display: "flex",
      gap: 10,
      marginTop: 16,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    outlinedButton: {
      backgroundColor: "transparent",
      border: "1px solid #FFFFFF",
      color: "#FFFFFF",
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      cursor: "pointer",
    },
    saveButton: {
      backgroundColor: "#2563EB",
      border: "none",
      color: "#FFFFFF",
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    },
    contentWrapper: {
      display: "flex",
      gap: 24,
      padding: "32px 80px 80px 80px",
      alignItems: "flex-start",
    },
    leftColumn: {
      width: "65%",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    },
    rightColumn: {
      width: "35%",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    },
    card: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 24,
    },
    cardSmall: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 20,
    },
    sectionHeading: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      fontSize: 20,
      color: "#1E293B",
      margin: "0 0 16px 0",
    },
    overviewGrid: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
      flexWrap: "wrap",
      gap: 16,
    },
    overviewItem: {
      textAlign: "center",
      flex: 1,
      minWidth: 140,
    },
    overviewLabel: {
      fontSize: 12,
      color: "#94A3B8",
      margin: "0 0 4px 0",
    },
    overviewValue: {
      fontSize: 15,
      fontWeight: 600,
      color: "#1E293B",
      margin: 0,
    },
    highlightsRow: {
      display: "flex",
      gap: 32,
      flexWrap: "wrap",
      marginBottom: 16,
    },
    highlightItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
    },
    highlightLabel: { color: "#64748B" },
    highlightValue: { color: "#1E293B", fontWeight: 600 },
    aiNote: {
      display: "flex",
      gap: 10,
      backgroundColor: "#EFF6FF",
      border: "1px solid #BFDBFE",
      borderRadius: 8,
      padding: 16,
    },
    aiNoteText: {
      fontSize: 13,
      color: "#1E40AF",
      margin: 0,
      lineHeight: 1.5,
    },
    dayCard: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      overflow: "hidden",
    },
    dayHeader: {
      width: "100%",
      minHeight: 56,
      backgroundColor: "#EFF6FF",
      borderBottom: "1px solid #BFDBFE",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexWrap: "wrap",
      gap: 8,
    },
    dayHeaderLeft: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    dayBadge: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 15,
    },
    dayDate:  { fontSize: 15, fontWeight: 500, color: "#1E293B" },
    dayCount: { fontSize: 13, color: "#64748B" },
    activitiesWrap: {
      padding: 24,
      display: "flex",
      flexDirection: "column",
    },
    activityRow: { display: "flex", gap: 0 },
    timeCol: {
      width: 80,
      flexShrink: 0,
      fontSize: 13,
      fontWeight: 500,
      color: "#2563EB",
      paddingTop: 2,
    },
    timelineCol: {
      width: 32,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: "#E2E8F0",
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      border: "2px solid #FFFFFF",
      boxShadow: "0 0 0 1px #E2E8F0",
      flexShrink: 0,
    },
    activityContent: {
      flex: 1,
      paddingLeft: 16,
      paddingBottom: 24,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    },
    typeBadge: {
      display: "inline-block",
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 10px",
      borderRadius: 12,
      width: "fit-content",
    },
    activityName: { fontSize: 15, fontWeight: 500, color: "#1E293B", margin: 0 },
    activityDesc: {
      fontSize: 13,
      color: "#64748B",
      margin: 0,
      lineHeight: 1.5,
    },
    bottomRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 4,
    },
    durationBadge: {
      backgroundColor: "#F1F5F9",
      color: "#475569",
      fontSize: 12,
      padding: "2px 10px",
      borderRadius: 10,
    },
    costText:   { fontSize: 12, color: "#94A3B8" },
    actionLink: { fontSize: 12, color: "#2563EB", cursor: "pointer", fontWeight: 500 },
    bookButton: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 6,
      padding: "6px 12px",
      fontSize: 12,
      cursor: "pointer",
      width: "fit-content",
    },
    budgetRows: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginBottom: 16,
    },
    budgetRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 14,
    },
    budgetLeft: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#64748B",
    },
    budgetDot:    { width: 10, height: 10, borderRadius: "50%" },
    budgetAmount: { fontWeight: 500, color: "#1E293B" },
    divider: {
      height: 1,
      backgroundColor: "#E2E8F0",
      margin: "16px 0",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    totalLabel: { fontSize: 15, fontWeight: 600, color: "#1E293B" },
    totalValue: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 20,
      color: "#1E293B",
    },
    remainingRow: {
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 20,
    },
    barChart: {
      width: "100%",
      height: 10,
      borderRadius: 6,
      display: "flex",
      overflow: "hidden",
      marginBottom: 16,
    },
    legendGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      color: "#64748B",
    },
    legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
    trainTimeline: { fontSize: 13, color: "#1E293B", marginBottom: 8 },
    classRow:      { fontSize: 13, color: "#64748B", marginBottom: 4 },
    availBadge: {
      display: "inline-block",
      backgroundColor: "#DCFCE7",
      color: "#166534",
      fontSize: 12,
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: 10,
      marginBottom: 14,
    },
    fullWidthBlueButton: {
      width: "100%",
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 8,
      padding: "12px 0",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
    hotelImage: {
      width: "100%",
      height: 160,
      borderRadius: 8,
      objectFit: "cover",
      marginBottom: 12,
      display: "block",
    },
    hotelName: { fontSize: 16, fontWeight: 500, color: "#1E293B", margin: "0 0 6px 0" },
    amenitiesRow: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      margin: "10px 0",
    },
    amenityChip: {
      backgroundColor: "#F1F5F9",
      color: "#475569",
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 12,
    },
    viewAltLink: {
      display: "block",
      textAlign: "center",
      color: "#2563EB",
      fontSize: 13,
      marginTop: 10,
      cursor: "pointer",
    },
    weatherRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      fontSize: 13,
      color: "#1E293B",
    },
    weatherTipBox: {
      backgroundColor: "#FFFBEB",
      border: "1px solid #FDE68A",
      borderRadius: 8,
      padding: 12,
      fontSize: 12,
      color: "#92400E",
      marginTop: 12,
      lineHeight: 1.5,
    },
    tipRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 0",
      fontSize: 13,
      color: "#64748B",
    },
    tipIcon: { color: "#2563EB", fontSize: 15, width: 18, textAlign: "center" },
  };

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          Your {numDays} {destination} Adventure
        </h1>
        <p style={styles.headerSubtext}>
          {destination} · {preferences.travellerType || "Travellers"} · ₹
          {(preferences.budget || 0).toLocaleString()} budget · {preferences.style || ""}
        </p>
        <div style={styles.statBadgeRow}>
          {stats.map((s, i) => (
            <span style={styles.statBadge} key={i}>{s}</span>
          ))}
        </div>
        <div style={styles.actionButtonsRow}>
          <button style={styles.outlinedButton}>⬇ Download PDF</button>
          <button style={styles.outlinedButton}>↗ Share</button>
          <button style={styles.outlinedButton} onClick={() => navigate("/itinerary")}>
            ✎ Edit
          </button>
          <button
           style={{
            ...styles.saveButton,
            opacity: saving || saved ? 0.8 : 1,
            backgroundColor: saved ? "#16A34A" : "#2563EB",
           }}
           onClick={handleSaveTrip}
           disabled={saving || saved}
          >
          {saved ? "✓ Saved!" : saving ? "Saving..." : "🔖 Save Trip"}
        </button>
        </div>
      </div>

      <div style={styles.contentWrapper}>
        {/* ── Left Column ── */}
        <div style={styles.leftColumn}>

          {/* Trip Overview */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Trip Overview</h2>
            <div style={styles.overviewGrid}>
              <div style={styles.overviewItem}>
                <p style={styles.overviewLabel}>Destination</p>
                <p style={styles.overviewValue}>{destination}</p>
              </div>
              <div style={styles.overviewItem}>
                <p style={styles.overviewLabel}>Duration</p>
                <p style={styles.overviewValue}>{numDays}</p>
              </div>
              <div style={styles.overviewItem}>
                <p style={styles.overviewLabel}>Travellers</p>
                <p style={styles.overviewValue}>{preferences.travellerType || "—"}</p>
              </div>
            </div>
            <div style={styles.highlightsRow}>
              <div style={styles.highlightItem}>
                <span>🏨</span>
                <span style={styles.highlightLabel}>Accommodation:</span>
                <span style={styles.highlightValue}>{preferences.accommodation || "—"}</span>
              </div>
              <div style={styles.highlightItem}>
                <span>🎯</span>
                <span style={styles.highlightLabel}>Style:</span>
                <span style={styles.highlightValue}>{preferences.style || "—"}</span>
              </div>
              <div style={styles.highlightItem}>
                <span>📍</span>
                <span style={styles.highlightLabel}>Places:</span>
                <span style={styles.highlightValue}>{placesCount}</span>
              </div>
              <div style={styles.highlightItem}>
                <span>💰</span>
                <span style={styles.highlightLabel}>Estimated cost:</span>
                <span style={styles.highlightValue}>₹{totalExpense.toLocaleString()}</span>
              </div>
            </div>
            {preferences.interests?.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {preferences.interests.map((interest, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
            <div style={styles.aiNote}>
              <span style={{ color: "#2563EB" }}>✨</span>
              <p style={styles.aiNoteText}>
                This itinerary is optimized for your budget and travel style preferences
              </p>
            </div>
          </div>

          {/* Day Cards */}
          {days.map((d, di) => (
            <div style={styles.dayCard} key={di}>
              <div style={styles.dayHeader}>
                <div style={styles.dayHeaderLeft}>
                  <div style={styles.dayBadge}>{d.day}</div>
                  <span style={styles.dayDate}>{d.date}</span>
                </div>
                <span style={styles.dayCount}>
                  {d.activities?.length || 0} activities
                </span>
              </div>
              <div style={styles.activitiesWrap}>
                {(d.activities || []).map((a, ai) => {
                  const badge = badgeColors[a.type] || { bg: "#F1F5F9", text: "#475569" };
                  const dot   = dotColors[a.type]   || "#94A3B8";
                  const isLast = ai === d.activities.length - 1;

                  // Groq/Gemini responses sometimes send action as null, a number,
                  // or a non-"Book"/string value — always verify it's a real string
                  // before calling string methods on it, or this crashes the whole page.
                  const actionText =
                    typeof a.action === "string" ? a.action : null;
                  const isBookAction =
                    actionText != null && actionText.includes("Book");
                  const isIRCTCAction =
                    actionText != null && actionText.includes("IRCTC");

                  return (
                    <div style={styles.activityRow} key={ai}>
                      <div style={styles.timeCol}>{a.time}</div>
                      <div style={styles.timelineCol}>
                        <div
                          style={{
                            ...styles.timelineDot,
                            backgroundColor: dot,
                            marginTop: 2,
                          }}
                        />
                        {!isLast && <div style={styles.timelineLine} />}
                      </div>
                      <div style={styles.activityContent}>
                        <span
                          style={{
                            ...styles.typeBadge,
                            backgroundColor: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {a.type}
                        </span>
                        <p style={styles.activityName}>{a.name}</p>
                        <p style={styles.activityDesc}>{a.desc}</p>
                        <div style={styles.bottomRow}>
                          {a.duration && (
                            <span style={styles.durationBadge}>{a.duration}</span>
                          )}
                          {a.cost && (
                            <span style={styles.costText}>{a.cost}</span>
                          )}
                          {isBookAction ? (
                            <button
                              style={styles.bookButton}
                              onClick={isIRCTCAction ? openIRCTC : openMakeMyTrip}
                            >
                              {actionText}
                            </button>
                          ) : actionText ? (
                            <span style={styles.actionLink}>{actionText}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Budget Breakdown */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Budget breakdown</h2>
            <p style={{ fontSize: 13, color: "#64748B", margin: "-10px 0 16px 0" }}>
              Estimated expenses · Budget: ₹{(preferences.budget || 0).toLocaleString()}
            </p>
            <div style={styles.budgetRows}>
              {expenses.map((e, i) => (
                <div style={styles.budgetRow} key={i}>
                  <div style={styles.budgetLeft}>
                    <span style={{ ...styles.budgetDot, backgroundColor: e.color }} />
                    <span>{e.label}</span>
                  </div>
                  <span style={styles.budgetAmount}>
                    ₹{(e.amount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.divider} />
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total estimated</span>
              <span style={styles.totalValue}>₹{totalExpense.toLocaleString()}</span>
            </div>
            <div
              style={{
                ...styles.remainingRow,
                backgroundColor: budgetRemaining >= 0 ? "#DCFCE7" : "#FEE2E2",
                color: budgetRemaining >= 0 ? "#166534" : "#991B1B",
              }}
            >
              {budgetRemaining >= 0
                ? `Under budget by ₹${budgetRemaining.toLocaleString()} ✓`
                : `Over budget by ₹${Math.abs(budgetRemaining).toLocaleString()} ⚠`}
            </div>
            <div style={styles.barChart}>
              {expenses.map((e, i) => (
                <div
                  key={i}
                  style={{
                    width: `${
                      totalExpense > 0
                        ? ((e.amount || 0) / totalExpense) * 100
                        : 0
                    }%`,
                    backgroundColor: e.color,
                  }}
                />
              ))}
            </div>
            <div style={styles.legendGrid}>
              {expenses.map((e, i) => (
                <div style={styles.legendItem} key={i}>
                  <span style={{ ...styles.legendDot, backgroundColor: e.color }} />
                  <span>
                    {e.label} — ₹{(e.amount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={styles.rightColumn}>

          {/* Train Card — uses resolvedTrain (falls back to activity data) */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Your train</h2>
            {resolvedTrain ? (
              <>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1E293B",
                    margin: "0 0 8px 0",
                  }}
                >
                  {resolvedTrain.name || "Recommended train"}
                </p>

                {/* If we extracted from activities, show a note */}
                {resolvedTrain.extractedFromActivities && (
                  <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px 0" }}>
                    ℹ️ Train details are in Day 1 activities above
                  </p>
                )}

                <p style={styles.trainTimeline}>
                  {resolvedTrain.departure || "Check IRCTC for timings"}
                </p>
                <p style={styles.classRow}>
                  Class: {resolvedTrain.class || "Sleeper (SL)"}
                  {resolvedTrain.pricePerPerson != null
                    ? ` · ₹${Number(resolvedTrain.pricePerPerson).toLocaleString()} per person`
                    : ""}
                </p>
                <span style={styles.availBadge}>Check availability on IRCTC</span>
                <button style={styles.fullWidthBlueButton} onClick={openIRCTC}>
                  Book on IRCTC ↗
                </button>

                {resolvedTrain.returnDeparture && (
                  <>
                    <div style={styles.divider} />
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1E293B",
                        margin: "0 0 8px 0",
                      }}
                    >
                      Return journey
                    </p>
                    <p style={styles.trainTimeline}>{resolvedTrain.returnDeparture}</p>
                    <p style={styles.classRow}>
                      Class: {resolvedTrain.class || "Sleeper (SL)"}
                      {resolvedTrain.pricePerPerson != null
                        ? ` · ₹${Number(resolvedTrain.pricePerPerson).toLocaleString()} per person`
                        : ""}
                    </p>
                    <span style={styles.availBadge}>Check availability</span>
                    <button style={styles.fullWidthBlueButton} onClick={openIRCTC}>
                      Book on IRCTC ↗
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px 0" }}>
                  No train info was generated. Search on IRCTC for trains to{" "}
                  {destination}.
                </p>
                <button style={styles.fullWidthBlueButton} onClick={openIRCTC}>
                  Search on IRCTC ↗
                </button>
              </>
            )}
          </div>

          {/* Hotel Card */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Recommended hotel</h2>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=320&fit=crop"
              alt={destination}
              style={styles.hotelImage}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=320&fit=crop";
              }}
            />
            <p style={styles.hotelName}>
              {hotel?.name || `Hotel in ${destination}`}
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 4px 0" }}>
              ★ {hotel?.rating || "4.0"} · {hotel?.location || destination}
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", margin: "8px 0" }}>
              {hotelPPN != null
                ? `₹${hotelPPN.toLocaleString()}/night × ${hotelRooms} room${
                    hotelRooms > 1 ? "s" : ""
                  } × ${hotelNights} night${
                    hotelNights > 1 ? "s" : ""
                  } = ₹${hotelTotal.toLocaleString()}`
                : `${hotelRooms} room${hotelRooms > 1 ? "s" : ""} · ${hotelNights} night${
                    hotelNights > 1 ? "s" : ""
                  } · Check MakeMyTrip for price`}
            </p>
            <div style={styles.amenitiesRow}>
              {(hotel?.amenities?.length > 0
                ? hotel.amenities
                : ["WiFi", "AC", "Breakfast", "Parking"]
              ).map((a, i) => (
                <span style={styles.amenityChip} key={i}>
                  {a}
                </span>
              ))}
            </div>
            <button style={styles.fullWidthBlueButton} onClick={openMakeMyTrip}>
              Book on MakeMyTrip ↗
            </button>
            <span
              style={styles.viewAltLink}
              onClick={() => window.open("https://www.booking.com", "_blank")}
            >
              View on Booking.com →
            </span>
          </div>

          {/* Weather Card */}
          {weatherTrip.length > 0 && (
            <div style={styles.cardSmall}>
              <h2 style={styles.sectionHeading}>Weather during your trip</h2>
              {weatherTrip.map((w, i) => (
                <div style={styles.weatherRow} key={i}>
                  <span>{w.date}</span>
                  <span>{w.icon}</span>
                  <span>{w.condition}</span>
                  <span style={{ fontWeight: 500 }}>{w.temp}</span>
                </div>
              ))}
              <div style={styles.weatherTipBox}>
                Check local weather before your trip and pack accordingly
              </div>
            </div>
          )}

          {/* Tips Card */}
          {tips.length > 0 && (
            <div style={styles.cardSmall}>
              <h2 style={styles.sectionHeading}>Quick tips for {destination}</h2>
              {tips.map((t, i) => (
                <div style={styles.tipRow} key={i}>
                  <span style={styles.tipIcon}>{t.icon}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interests Card */}
          {preferences.interests?.length > 0 && (
            <div style={styles.cardSmall}>
              <h2 style={styles.sectionHeading}>Your interests</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {preferences.interests.map((interest, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                      fontSize: 13,
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "1px solid #BFDBFE",
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
