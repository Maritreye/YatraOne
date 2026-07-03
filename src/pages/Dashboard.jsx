import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { stats, activities } from "../data/dashboard.json";

export default function Dashboard() {
  const navigate = useNavigate();
  const { mongoUser, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Real data from backend
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [aiItineraries, setAiItineraries] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [reminders, setReminders] = useState([
    { text: "Book hotel for Jaipur trip", due: "Due in 3 days", urgency: "soon", checked: false },
    { text: "Download e-tickets for Kashi Express", due: "Due in 5 days", urgency: "upcoming", checked: false },
    { text: "Check weather forecast for Jaipur", due: "Completed", urgency: "completed", checked: true },
  ]);

  // Fetch all dashboard data once mongoUser is available
  useEffect(() => {
    if (!mongoUser?._id) return;

    const fetchDashboardData = async () => {
      try {
        const [tripsRes, placesRes, itinerariesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/trips/user/${mongoUser._id}`),
          fetch(`http://localhost:5000/api/saved-places/user/${mongoUser._id}`),
          fetch(`http://localhost:5000/api/itineraries/user/${mongoUser._id}`),
        ]);

        const tripsData = await tripsRes.json();
        const placesData = await placesRes.json();
        const itinerariesData = await itinerariesRes.json();

        // Only show Upcoming trips on dashboard
        const upcoming = Array.isArray(tripsData)
          ? tripsData.filter((t) => t.status === "Upcoming")
          : [];

        setUpcomingTrips(upcoming);
        setSavedPlaces(Array.isArray(placesData) ? placesData : []);
        setAiItineraries(Array.isArray(itinerariesData) ? itinerariesData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [mongoUser]);

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/dashboard" },
    { label: "My Trips", icon: "💼", path: "/saved" },
    { label: "Saved Places", icon: "🔖", path: "/saved" },
    { label: "Booking History", icon: "🕘", path: "/bookings" },
    { label: "AI Itineraries", icon: "✨", path: "/itinerary" },
    { label: "Travel Reminders", icon: "🔔", path: "/dashboard" },
    { label: "Settings", icon: "⚙️", path: "/profile" },
    { label: "Help & Support", icon: "❓", path: "/about" },
  ];

  const urgencyColors = {
    overdue: { bg: "#FEE2E2", text: "#991B1B" },
    soon: { bg: "#FEF9C3", text: "#854D0E" },
    upcoming: { bg: "#DBEAFE", text: "#1E40AF" },
    completed: { bg: "#DCFCE7", text: "#166534" },
  };

  const toggleReminder = (index) => {
    setReminders((prev) =>
      prev.map((r, i) => (i === index ? { ...r, checked: !r.checked } : r))
    );
  };

  const deleteReminder = (index) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const editReminder = (index) => {
    const current = reminders[index];
    const newText = window.prompt("Edit reminder:", current.text);
    if (newText && newText.trim() !== "") {
      setReminders((prev) =>
        prev.map((r, i) => (i === index ? { ...r, text: newText.trim() } : r))
      );
    }
  };

  const addReminder = () => {
    const text = window.prompt("Enter new reminder:");
    if (text && text.trim() !== "") {
      setReminders((prev) => [
        ...prev,
        { text: text.trim(), due: "Due soon", urgency: "soon", checked: false },
      ]);
    }
  };

  const stars = (count) => "★".repeat(Math.round(count)) + "☆".repeat(5 - Math.round(count));

  // Display name helpers
  const displayName = mongoUser?.name || "Traveller";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const displayEmail = mongoUser?.email || "";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const styles = {
    page: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#F8FAFC",
      fontFamily: "Inter, sans-serif",
    },
    sidebar: {
      width: 260,
      flexShrink: 0,
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #E2E8F0",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "100vh",
      position: "sticky",
      top: 0,
    },
    profileSection: {
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: 20,
      marginBottom: 6,
    },
    userName: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: 16,
      color: "#1E293B",
      margin: 0,
    },
    userEmail: {
      fontSize: 13,
      color: "#94A3B8",
      margin: 0,
    },
    editProfileLink: {
      fontSize: 12,
      color: "#2563EB",
      cursor: "pointer",
      marginTop: 4,
    },
    sidebarDivider: {
      height: 1,
      backgroundColor: "#E2E8F0",
      margin: "8px 0",
    },
    navMenu: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: "0 12px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      height: 44,
      borderRadius: 8,
      padding: "0 16px",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
      color: "#64748B",
      backgroundColor: "transparent",
      borderLeft: "3px solid transparent",
    },
    menuItemActive: {
      backgroundColor: "#EFF6FF",
      color: "#2563EB",
      borderLeft: "3px solid #2563EB",
    },
    sidebarBottom: {
      padding: 16,
    },
    logoutRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      height: 44,
      padding: "0 16px",
      color: "#EF4444",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer",
    },
    versionText: {
      fontSize: 11,
      color: "#94A3B8",
      textAlign: "center",
      marginTop: 8,
    },
    mainContent: {
      flex: 1,
      padding: 32,
      minWidth: 0,
    },
    welcomeBanner: {
      width: "100%",
      minHeight: 120,
      backgroundColor: "#1E293B",
      borderRadius: 16,
      padding: "28px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16,
    },
    welcomeGreeting: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 24,
      color: "#FFFFFF",
      margin: "0 0 6px 0",
    },
    welcomeSubtext: {
      fontSize: 14,
      color: "rgba(255,255,255,0.7)",
      margin: 0,
    },
    planTripButton: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
    statsRow: {
      display: "flex",
      gap: 16,
      marginTop: 24,
      flexWrap: "wrap",
    },
    statCard: {
      flex: 1,
      minWidth: 200,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 20,
      position: "relative",
    },
    statIconCircle: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      marginBottom: 12,
    },
    statNumber: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 28,
      color: "#1E293B",
      margin: 0,
    },
    statLabel: {
      fontSize: 13,
      color: "#64748B",
      margin: "2px 0 8px 0",
    },
    statTrend: {
      fontSize: 11,
      color: "#166534",
      fontWeight: 500,
    },
    sectionHeadingRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 32,
      marginBottom: 16,
    },
    sectionHeading: {
      fontSize: 18,
      fontWeight: 500,
      color: "#1E293B",
      margin: 0,
    },
    viewAllLink: {
      fontSize: 14,
      color: "#2563EB",
      cursor: "pointer",
    },
    tripsRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
    },
    tripCard: {
      flex: 1,
      minWidth: 320,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      overflow: "hidden",
    },
    tripImageWrap: {
      position: "relative",
      width: "100%",
      height: 160,
    },
    tripImage: {
      width: "100%",
      height: 160,
      objectFit: "cover",
      display: "block",
    },
    statusBadge: {
      position: "absolute",
      top: 12,
      left: 12,
      backgroundColor: "#DCFCE7",
      color: "#166534",
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 10px",
      borderRadius: 10,
    },
    daysBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 10px",
      borderRadius: 10,
    },
    tripContent: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    tripDestination: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: 18,
      color: "#1E293B",
      margin: 0,
    },
    tripInfoRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      color: "#64748B",
    },
    tripBottomRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },
    viewItineraryButton: {
      backgroundColor: "transparent",
      border: "1px solid #2563EB",
      color: "#2563EB",
      borderRadius: 8,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    },
    editLink: {
      fontSize: 13,
      color: "#94A3B8",
      cursor: "pointer",
    },
    activityCard: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 24,
    },
    activityRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 0",
      borderBottom: "1px solid #F1F5F9",
    },
    activityIconCircle: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      flexShrink: 0,
    },
    activityCenter: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    activityText: {
      fontSize: 14,
      color: "#1E293B",
      margin: 0,
    },
    activityTime: {
      fontSize: 12,
      color: "#94A3B8",
      margin: 0,
    },
    activityAction: {
      fontSize: 13,
      color: "#2563EB",
      cursor: "pointer",
      flexShrink: 0,
    },
    placesRow: {
      display: "flex",
      gap: 16,
      overflowX: "auto",
      paddingBottom: 8,
    },
    placeCard: {
      width: 200,
      flexShrink: 0,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      overflow: "hidden",
    },
    placeImageWrap: {
      position: "relative",
      width: "100%",
      height: 120,
    },
    placeImage: {
      width: "100%",
      height: 120,
      objectFit: "cover",
      display: "block",
    },
    heartIcon: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      color: "#EF4444",
    },
    placeContent: {
      padding: 12,
    },
    placeName: {
      fontSize: 14,
      fontWeight: 500,
      color: "#1E293B",
      margin: "0 0 2px 0",
    },
    placeMeta: {
      fontSize: 12,
      color: "#94A3B8",
      margin: "0 0 4px 0",
    },
    placeRating: {
      fontSize: 12,
      color: "#F59E0B",
    },
    itinerariesRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
    },
    itineraryCard: {
      flex: 1,
      minWidth: 260,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 20,
    },
    itineraryTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    itineraryDestination: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: 16,
      color: "#1E293B",
      margin: 0,
    },
    itineraryDates: {
      fontSize: 13,
      color: "#94A3B8",
    },
    itineraryStats: {
      fontSize: 13,
      color: "#64748B",
      margin: "0 0 14px 0",
    },
    progressTrack: {
      width: "100%",
      height: 6,
      backgroundColor: "#E2E8F0",
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 10,
    },
    progressFill: {
      height: "100%",
      borderRadius: 999,
    },
    createNewButton: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 8,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    },
    itineraryBottomRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    remindersCard: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 24,
    },
    reminderRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 0",
      borderBottom: "1px solid #F1F5F9",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 5,
      border: "1.5px solid #E2E8F0",
      flexShrink: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      color: "#FFFFFF",
    },
    reminderCenter: {
      flex: 1,
    },
    reminderText: {
      fontSize: 14,
      color: "#1E293B",
      margin: 0,
    },
    reminderDue: {
      fontSize: 12,
      color: "#94A3B8",
      margin: "2px 0 0 0",
    },
    urgencyBadge: {
      fontSize: 11,
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: 10,
      flexShrink: 0,
    },
    reminderIcons: {
      display: "flex",
      gap: 10,
      marginLeft: 10,
      flexShrink: 0,
    },
    iconBtn: {
      fontSize: 14,
      color: "#94A3B8",
      cursor: "pointer",
      userSelect: "none",
    },
    emptyState: {
      fontSize: 14,
      color: "#94A3B8",
      padding: "20px 0",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>{initials}</div>
            <p style={styles.userName}>{displayName}</p>
            <p style={styles.userEmail}>{displayEmail}</p>
            <span style={styles.editProfileLink} onClick={() => navigate("/profile")}>
              Edit Profile
            </span>
          </div>
          <div style={styles.sidebarDivider}></div>
          <div style={styles.navMenu}>
            {menuItems.map((item) => (
              <div
                key={item.label}
                style={
                  activeMenu === item.label
                    ? { ...styles.menuItem, ...styles.menuItemActive }
                    : styles.menuItem
                }
                onClick={() => {
                  setActiveMenu(item.label);
                  navigate(item.path);
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.sidebarDivider}></div>
          <div style={styles.logoutRow} onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
          <p style={styles.versionText}>v1.0.0</p>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.welcomeBanner}>
          <div>
            <p style={styles.welcomeGreeting}>Good morning, {firstName} 👋</p>
            <p style={styles.welcomeSubtext}>
              {upcomingTrips.length > 0
                ? `You have ${upcomingTrips.length} upcoming trip${upcomingTrips.length > 1 ? "s" : ""}`
                : "Ready to plan your next adventure?"}
            </p>
          </div>
          <button style={styles.planTripButton} onClick={() => navigate("/itinerary")}>
            Plan New Trip
          </button>
        </div>

        {/* Stats — still from JSON (no backend endpoint) */}
        <div style={styles.statsRow}>
          {stats.map((s, i) => (
            <div style={styles.statCard} key={i}>
              <div style={{ ...styles.statIconCircle, backgroundColor: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <p style={styles.statNumber}>{s.value}</p>
              <p style={styles.statLabel}>{s.label}</p>
              <span style={styles.statTrend}>{s.trend}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Trips */}
        <div style={styles.sectionHeadingRow}>
          <h2 style={styles.sectionHeading}>Upcoming trips</h2>
          <span style={styles.viewAllLink} onClick={() => navigate("/saved")}>
            View all →
          </span>
        </div>
        {dataLoading ? (
          <p style={styles.emptyState}>Loading trips...</p>
        ) : upcomingTrips.length === 0 ? (
          <p style={styles.emptyState}>No upcoming trips yet. Plan one!</p>
        ) : (
          <div style={styles.tripsRow}>
            {upcomingTrips.map((t, i) => (
              <div style={styles.tripCard} key={t._id || i}>
                <div style={styles.tripImageWrap}>
                  <img src={t.img} alt={t.destination} style={styles.tripImage} />
                  <span style={styles.statusBadge}>Upcoming</span>
                  {t.duration && <span style={styles.daysBadge}>{t.duration}</span>}
                </div>
                <div style={styles.tripContent}>
                  <p style={styles.tripDestination}>{t.destination}</p>
                  {t.dates && (
                    <div style={styles.tripInfoRow}>
                      <span>📅</span>
                      <span>{t.dates}</span>
                    </div>
                  )}
                  {t.travellers && (
                    <div style={styles.tripInfoRow}>
                      <span>👥</span>
                      <span>{t.travellers}</span>
                    </div>
                  )}
                  {t.trainStatus && (
                    <div style={styles.tripInfoRow}>
                      <span>🚆</span>
                      <span>{t.trainStatus}</span>
                    </div>
                  )}
                  {t.hotelStatus && (
                    <div style={styles.tripInfoRow}>
                      <span>🛏️</span>
                      <span>{t.hotelStatus}</span>
                    </div>
                  )}
                  <div style={styles.tripBottomRow}>
                    <button
                      style={styles.viewItineraryButton}
                      onClick={() =>
                        t.itineraryId
                          ? navigate(`/itinerary/result/${t.itineraryId}`)
                          : navigate("/itinerary/result")
                      }
                    >
                      View Itinerary →
                    </button>
                    <span style={styles.editLink}>Edit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity — still from JSON */}
        <div style={styles.sectionHeadingRow}>
          <h2 style={styles.sectionHeading}>Recent activity</h2>
          <span style={styles.viewAllLink}>View all →</span>
        </div>
        <div style={styles.activityCard}>
          {activities.map((a, i) => (
            <div
              style={
                i === activities.length - 1
                  ? { ...styles.activityRow, borderBottom: "none" }
                  : styles.activityRow
              }
              key={i}
            >
              <div style={{ ...styles.activityIconCircle, backgroundColor: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <div style={styles.activityCenter}>
                <p style={styles.activityText}>{a.text}</p>
                <p style={styles.activityTime}>{a.time}</p>
              </div>
              {a.action && <span style={styles.activityAction}>{a.action}</span>}
            </div>
          ))}
        </div>

        {/* Saved Places */}
        <div style={styles.sectionHeadingRow}>
          <h2 style={styles.sectionHeading}>Saved places</h2>
          <span style={styles.viewAllLink} onClick={() => navigate("/saved")}>
            View all →
          </span>
        </div>
        {dataLoading ? (
          <p style={styles.emptyState}>Loading saved places...</p>
        ) : savedPlaces.length === 0 ? (
          <p style={styles.emptyState}>No saved places yet.</p>
        ) : (
          <div style={styles.placesRow}>
            {savedPlaces.map((p, i) => (
              <div style={styles.placeCard} key={p._id || i}>
                <div style={styles.placeImageWrap}>
                  <img src={p.img} alt={p.name} style={styles.placeImage} />
                  <div style={styles.heartIcon}>❤️</div>
                </div>
                <div style={styles.placeContent}>
                  <p style={styles.placeName}>{p.name}</p>
                  <p style={styles.placeMeta}>
                    {p.city} · {p.category}
                  </p>
                  <span style={styles.placeRating}>
                    {stars(p.rating)} {p.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Itineraries */}
        <div style={styles.sectionHeadingRow}>
          <h2 style={styles.sectionHeading}>Your AI itineraries</h2>
          <button style={styles.createNewButton} onClick={() => navigate("/itinerary")}>
            Create new +
          </button>
        </div>
        {dataLoading ? (
          <p style={styles.emptyState}>Loading itineraries...</p>
        ) : aiItineraries.length === 0 ? (
          <p style={styles.emptyState}>No itineraries yet. Create one with AI!</p>
        ) : (
          <div style={styles.itinerariesRow}>
            {aiItineraries.map((it, i) => (
              <div style={styles.itineraryCard} key={it._id || i}>
                <div style={styles.itineraryTopRow}>
                  <p style={styles.itineraryDestination}>{it.destination}</p>
                  <span style={styles.itineraryDates}>
                    {it.days?.length ? `${it.days.length} days` : ""}
                  </span>
                </div>
                <p style={styles.itineraryStats}>
                  {it.stats?.join(" · ") || `${it.preferences?.style || ""} · ${it.preferences?.budget || ""}`}
                </p>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "100%",
                      backgroundColor: "#2563EB",
                    }}
                  ></div>
                </div>
                <span
                  style={{
                    ...styles.urgencyBadge,
                    backgroundColor: "#DCFCE7",
                    color: "#166534",
                  }}
                >
                  Complete
                </span>
                <div style={styles.itineraryBottomRow}>
                  <span
                    style={styles.viewAllLink}
                    onClick={() => navigate(`/itinerary/result/${it._id}`)}
                  >
                    View →
                  </span>
                  <span style={{ color: "#94A3B8", cursor: "pointer" }}>...</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reminders */}
        <div style={styles.sectionHeadingRow}>
          <h2 style={styles.sectionHeading}>Reminders</h2>
          <span style={styles.viewAllLink} onClick={addReminder}>
            Add reminder +
          </span>
        </div>
        <div style={styles.remindersCard}>
          {reminders.map((r, i) => {
            const u = urgencyColors[r.urgency];
            return (
              <div
                style={
                  i === reminders.length - 1
                    ? { ...styles.reminderRow, borderBottom: "none" }
                    : styles.reminderRow
                }
                key={i}
              >
                <div
                  style={{
                    ...styles.checkbox,
                    backgroundColor: r.checked ? "#2563EB" : "transparent",
                    borderColor: r.checked ? "#2563EB" : "#E2E8F0",
                  }}
                  onClick={() => toggleReminder(i)}
                >
                  {r.checked ? "✓" : ""}
                </div>
                <div style={styles.reminderCenter}>
                  <p
                    style={{
                      ...styles.reminderText,
                      textDecoration: r.checked ? "line-through" : "none",
                      color: r.checked ? "#94A3B8" : "#1E293B",
                    }}
                  >
                    {r.text}
                  </p>
                  <p style={styles.reminderDue}>{r.due}</p>
                </div>
                <span
                  style={{
                    ...styles.urgencyBadge,
                    backgroundColor: u.bg,
                    color: u.text,
                  }}
                >
                  {r.urgency === "soon"
                    ? "Due soon"
                    : r.urgency === "upcoming"
                    ? "Upcoming"
                    : r.urgency === "completed"
                    ? "Completed"
                    : "Overdue"}
                </span>
                <div style={styles.reminderIcons}>
                  <span style={styles.iconBtn} onClick={() => editReminder(i)}>
                    ✎
                  </span>
                  <span style={styles.iconBtn} onClick={() => deleteReminder(i)}>
                    🗑
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
