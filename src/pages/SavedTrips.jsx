import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";


export default function SavedTrips() {
  const navigate = useNavigate();
  const [activeMenu] = useState("My Trips");
  const [activeTab, setActiveTab] = useState("All Trips");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date added (newest first)");
  const [viewMode, setViewMode] = useState("grid");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const { mongoUser } = useAuth();

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

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
  if (!mongoUser?._id) return;
  fetch(`http://localhost:5000/api/trips/user/${mongoUser._id}`)
    .then((res) => res.json())
    .then((data) => {
      setTrips(Array.isArray(data) ? data : []);
      setLoadingTrips(false);
    })
    .catch((err) => {
      console.error("Failed to load trips:", err);
      setLoadingTrips(false);
    });
}, [mongoUser]);

  const tabs = [
    { label: "All Trips", count: trips.length },
    { label: "Upcoming", count: trips.filter((t) => t.status === "Upcoming").length },
    { label: "Completed", count: trips.filter((t) => t.status === "Completed").length },
    { label: "Draft", count: trips.filter((t) => t.status === "Draft").length },
    { label: "Cancelled", count: trips.filter((t) => t.status === "Cancelled").length },
  ];

  const statusStyles = {
    Upcoming: { bg: "#DCFCE7", text: "#166534", progress: 30, progressColor: "#2563EB" },
    Completed: { bg: "#F1F5F9", text: "#475569", progress: 100, progressColor: "#10B981" },
    Draft: { bg: "#FEF9C3", text: "#854D0E", progress: 10, progressColor: "#E2E8F0" },
    Cancelled: { bg: "#FEE2E2", text: "#991B1B", progress: 0, progressColor: "#FCA5A5" },
  };

  const chipStyle = (status) => {
    if (status.includes("booked")) return { bg: "#DCFCE7", text: "#166534" };
    if (status.includes("pending")) return { bg: "#FEF9C3", text: "#854D0E" };
    return { bg: "#FEE2E2", text: "#991B1B" };
  };

  const filteredTrips = trips
    .filter((t) => activeTab === "All Trips" || t.status === activeTab)
    .filter((t) => t.destination.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      fetch(`http://localhost:5000/api/trips/${id}`, { method: "DELETE" })
  .then(() => setTrips((prev) => prev.filter((t) => t._id !== id)));
    }
    setOpenMenuIndex(null);
  };

  const handleShare = () => {
    window.alert("Share link copied to clipboard!");
    setOpenMenuIndex(null);
  };

  const emptyStateText = {
    Upcoming: ["No upcoming trips", "Start planning your next adventure"],
    Completed: ["No completed trips yet", "Your finished journeys will appear here"],
    Draft: ["No drafts saved", "Unfinished itineraries will show up here"],
    Cancelled: ["No cancelled trips", "Cancelled trips will show up here"],
    "All Trips": ["No trips found", "Start planning your next adventure"],
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
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 16,
    },
    pageTitle: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 28,
      color: "#1E293B",
      margin: 0,
    },
    pageSubtext: {
      fontSize: 14,
      color: "#64748B",
      margin: "4px 0 0 0",
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
    tabsRow: {
      display: "flex",
      gap: 0,
      borderBottom: "1px solid #E2E8F0",
      marginTop: 24,
      flexWrap: "wrap",
    },
    tab: {
      padding: "0 20px",
      height: 48,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14,
      fontWeight: 500,
      color: "#64748B",
      cursor: "pointer",
      borderBottom: "2px solid transparent",
    },
    tabActive: {
      color: "#2563EB",
      borderBottom: "2px solid #2563EB",
    },
    tabCount: {
      fontSize: 12,
      color: "#94A3B8",
    },
    searchSortRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
      flexWrap: "wrap",
      gap: 12,
    },
    searchInput: {
      width: 300,
      height: 40,
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "0 14px",
      fontSize: 14,
      color: "#1E293B",
      outline: "none",
    },
    sortRow: {
      display: "flex",
      gap: 10,
      alignItems: "center",
    },
    sortDropdown: {
      width: 220,
      height: 40,
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "0 10px",
      fontSize: 13,
      color: "#1E293B",
      backgroundColor: "#FFFFFF",
    },
    toggleButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      border: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 16,
      backgroundColor: "#FFFFFF",
      color: "#64748B",
    },
    toggleButtonActive: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "1px solid #2563EB",
    },
    gridWrap: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
      marginTop: 24,
    },
    card: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    cardDraft: {
      border: "1px dashed #CBD5E1",
    },
    imageWrap: {
      position: "relative",
      width: "100%",
      height: 200,
    },
    cardImage: {
      width: "100%",
      height: 200,
      objectFit: "cover",
      display: "block",
    },
    imageOverlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    statusBadgeImg: {
      position: "absolute",
      top: 12,
      left: 12,
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 12px",
      borderRadius: 12,
    },
    moreButton: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 16,
      color: "#64748B",
    },
    daysToGoBadge: {
      position: "absolute",
      top: 52,
      right: 12,
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 10px",
      borderRadius: 10,
    },
    progressBarTrack: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: 4,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    progressBarFill: {
      height: "100%",
    },
    moreDropdown: {
      position: "absolute",
      top: 48,
      right: 12,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: 8,
      width: 170,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 10,
    },
    dropdownItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      fontSize: 13,
      color: "#1E293B",
      cursor: "pointer",
      borderRadius: 6,
    },
    dropdownItemDanger: {
      color: "#EF4444",
    },
    cardContent: {
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    rowBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tripName: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: 20,
      color: "#1E293B",
      margin: 0,
    },
    statusPill: {
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 12px",
      borderRadius: 12,
      flexShrink: 0,
    },
    dateRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      color: "#64748B",
    },
    detailsRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      fontSize: 14,
      color: "#64748B",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    chipsRow: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    },
    chip: {
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 20,
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    placesRow: {
      display: "flex",
      alignItems: "center",
    },
    placeCircle: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "2px solid #FFFFFF",
      backgroundColor: "#E2E8F0",
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginLeft: -10,
    },
    placesCountBadge: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "2px solid #FFFFFF",
      backgroundColor: "#1E293B",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: -10,
    },
    placesText: {
      fontSize: 12,
      color: "#94A3B8",
      marginTop: 6,
    },
    actionsRow: {
      display: "flex",
      gap: 8,
      marginTop: 4,
    },
    viewButton: {
      flex: 1,
      backgroundColor: "transparent",
      border: "1px solid #2563EB",
      color: "#2563EB",
      borderRadius: 8,
      padding: "10px 0",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
    rebookButton: {
      flex: 1,
      backgroundColor: "transparent",
      border: "1px solid #EF4444",
      color: "#EF4444",
      borderRadius: 8,
      padding: "10px 0",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
    iconSquareButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      border: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 16,
      backgroundColor: "#FFFFFF",
      flexShrink: 0,
    },
    listRow: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    listImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      objectFit: "cover",
      flexShrink: 0,
    },
    listCenter: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 0,
    },
    listTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    listTripName: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: 16,
      color: "#1E293B",
      margin: 0,
    },
    listDateRow: {
      fontSize: 13,
      color: "#64748B",
    },
    listChipsRow: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    },
    listRight: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexShrink: 0,
    },
    emptyState: {
      width: 400,
      margin: "60px auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      textAlign: "center",
    },
    emptyCircle: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      backgroundColor: "#F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      color: "#94A3B8",
    },
    emptyHeading: {
      fontSize: 20,
      fontWeight: 500,
      color: "#1E293B",
      margin: 0,
    },
    emptySubtext: {
      fontSize: 14,
      color: "#64748B",
      margin: 0,
    },
    loadMoreButton: {
      width: "100%",
      backgroundColor: "transparent",
      border: "1px solid #2563EB",
      color: "#2563EB",
      borderRadius: 8,
      padding: "12px 0",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      marginTop: 24,
    },
  };

  if (loadingTrips) return <p style={{ padding: 40 }}>Loading trips...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
             {mongoUser?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <p style={styles.userName}>{mongoUser?.name || "User"}</p>
            <p style={styles.userEmail}>{mongoUser?.email || ""}</p>
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
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.sidebarDivider}></div>
          <div style={styles.logoutRow} onClick={() => navigate("/login")}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
          <p style={styles.versionText}>v1.0.0</p>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>My Trips</h1>
            <p style={styles.pageSubtext}>All your planned and saved trips in one place</p>
          </div>
          <button style={styles.planTripButton} onClick={() => navigate("/itinerary")}>
            Plan New Trip +
          </button>
        </div>

        <div style={styles.tabsRow}>
          {tabs.map((t) => (
            <div
              key={t.label}
              style={
                activeTab === t.label ? { ...styles.tab, ...styles.tabActive } : styles.tab
              }
              onClick={() => setActiveTab(t.label)}
            >
              <span>{t.label}</span>
              <span style={styles.tabCount}>({t.count})</span>
            </div>
          ))}
        </div>

        <div style={styles.searchSortRow}>
          <input
            style={styles.searchInput}
            placeholder="Search your trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={styles.sortRow}>
            <select
              style={styles.sortDropdown}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Date added (newest first)</option>
              <option>Trip date (soonest first)</option>
              <option>Destination A–Z</option>
              <option>Budget (lowest first)</option>
            </select>
            <div
              style={
                viewMode === "grid"
                  ? { ...styles.toggleButton, ...styles.toggleButtonActive }
                  : styles.toggleButton
              }
              onClick={() => setViewMode("grid")}
            >
              ▦
            </div>
            <div
              style={
                viewMode === "list"
                  ? { ...styles.toggleButton, ...styles.toggleButtonActive }
                  : styles.toggleButton
              }
              onClick={() => setViewMode("list")}
            >
              ☰
            </div>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyCircle}>✈️</div>
            <h2 style={styles.emptyHeading}>
              {(emptyStateText[activeTab] || emptyStateText["All Trips"])[0]}
            </h2>
            <p style={styles.emptySubtext}>
              {(emptyStateText[activeTab] || emptyStateText["All Trips"])[1]}
            </p>
            <button style={styles.planTripButton} onClick={() => navigate("/itinerary")}>
              Plan a trip +
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div style={styles.gridWrap}>
            {filteredTrips.map((trip, i) => {
              const s = statusStyles[trip.status];
              const trainChip = chipStyle(trip.trainStatus);
              const hotelChip = chipStyle(trip.hotelStatus);
              const isDraft = trip.status === "Draft";
              const isCompleted = trip.status === "Completed";
              const isCancelled = trip.status === "Cancelled";

              return (
                <div
                  style={isDraft ? { ...styles.card, ...styles.cardDraft } : styles.card}
                  key={trip._id}
                >
                  <div style={styles.imageWrap}>
                    <img src={trip.img} alt={trip.destination} style={styles.cardImage} />
                    {(isCompleted || isCancelled) && (
                      <div
                        style={{
                          ...styles.imageOverlay,
                          backgroundColor: isCancelled
                            ? "rgba(0,0,0,0.4)"
                            : "rgba(0,0,0,0.2)",
                        }}
                      ></div>
                    )}
                    <span
                      style={{
                        ...styles.statusBadgeImg,
                        backgroundColor: s.bg,
                        color: s.text,
                      }}
                    >
                      {trip.status}
                    </span>
                    <div
                      style={styles.moreButton}
                      onClick={() =>
                        setOpenMenuIndex(openMenuIndex === trip._id ? null : trip._id)
                      }
                    >
                      ⋯
                    </div>
                    {trip.daysToGo && (
                      <span style={styles.daysToGoBadge}>{trip.daysToGo}</span>
                    )}
                    <div style={styles.progressBarTrack}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${s.progress}%`,
                          backgroundColor: s.progressColor,
                        }}
                      ></div>
                    </div>
                    {openMenuIndex === trip._id && (
                      <div style={styles.moreDropdown}>
                        <div style={styles.dropdownItem} onClick={() => navigate("/itinerary")}>
                          ✎ Edit trip
                        </div>
                        <div style={styles.dropdownItem} onClick={handleShare}>
                          ↗ Share trip
                        </div>
                        <div style={styles.dropdownItem}>⧉ Duplicate trip</div>
                        <div style={styles.dropdownItem}>📅 Add to calendar</div>
                        <div style={styles.sidebarDivider}></div>
                        <div
                          style={{ ...styles.dropdownItem, ...styles.dropdownItemDanger }}
                          onClick={() => handleDelete(trip._id)}
                        >
                          🗑 Delete trip
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.rowBetween}>
                      <p style={styles.tripName}>{trip.destination}</p>
                      <span
                        style={{
                          ...styles.statusPill,
                          backgroundColor: s.bg,
                          color: s.text,
                        }}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div style={styles.dateRow}>
                      <span>📅</span>
                      <span>{trip.dates}</span>
                      <span>·</span>
                      <span>{trip.duration}</span>
                    </div>

                    <div style={styles.detailsRow}>
                      <div style={styles.detailItem}>
                        <span>👥</span>
                        <span>{trip.travellers}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span>₹</span>
                        <span>{trip.budget}</span>
                      </div>
                    </div>

                    <div style={styles.chipsRow}>
                      <span
                        style={{
                          ...styles.chip,
                          backgroundColor: trainChip.bg,
                          color: trainChip.text,
                        }}
                      >
                        🚆 {trip.trainStatus}
                      </span>
                      <span
                        style={{
                          ...styles.chip,
                          backgroundColor: hotelChip.bg,
                          color: hotelChip.text,
                        }}
                      >
                        🛏️ {trip.hotelStatus}
                      </span>
                    </div>

                    {trip.placesCount > 0 && (
                      <div>
                        <div style={styles.placesRow}>
                          {[1, 2, 3, 4, 5].slice(0, Math.min(5, trip.placesCount)).map((p, idx) => (
                            <div
                              style={{
                                ...styles.placeCircle,
                                marginLeft: idx === 0 ? 0 : -10,
                                backgroundImage: `url(https://images.unsplash.com/photo-${
                                  1500000000000 + idx * 12345
                                }?w=80&h=80&fit=crop)`,
                              }}
                              key={idx}
                            ></div>
                          ))}
                          {trip.placesCount > 5 && (
                            <div style={styles.placesCountBadge}>
                              +{trip.placesCount - 5}
                            </div>
                          )}
                        </div>
                        <p style={styles.placesText}>{trip.placesCount} places planned</p>
                      </div>
                    )}

                    <div style={styles.actionsRow}>
                      {isDraft ? (
                        <button style={styles.viewButton} onClick={() => navigate(`/itinerary/result/${trip.itineraryId}`)}>
                          Continue planning →
                        </button>
                      ) : isCancelled ? (
                        <button style={styles.rebookButton} onClick={() => navigate("/itinerary")}>
                          Rebook trip
                        </button>
                      ) : (
                        <button
                          style={styles.viewButton}
                          onClick={() => navigate(`/itinerary/result/${trip.itineraryId}`)}
                        >
                          {isCompleted ? "View memories →" : "View Itinerary"}
                        </button>
                      )}
                      <div style={styles.iconSquareButton} onClick={handleShare}>
                        ↗
                      </div>
                      <div
                        style={styles.iconSquareButton}
                        onClick={() => handleDelete(trip._id)}
                      >
                        🗑
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            {filteredTrips.map((trip) => {
              const s = statusStyles[trip.status];
              const trainChip = chipStyle(trip.trainStatus);
              const hotelChip = chipStyle(trip.hotelStatus);
              return (
                <div style={styles.listRow} key={trip._id}>
                  <img src={trip.img} alt={trip.destination} style={styles.listImage} />
                  <div style={styles.listCenter}>
                    <div style={styles.listTopRow}>
                      <p style={styles.listTripName}>{trip.destination}</p>
                      <span
                        style={{
                          ...styles.statusPill,
                          backgroundColor: s.bg,
                          color: s.text,
                        }}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <p style={styles.listDateRow}>
                      {trip.dates} · {trip.duration}
                    </p>
                    <div style={styles.listChipsRow}>
                      <span
                        style={{
                          ...styles.chip,
                          backgroundColor: trainChip.bg,
                          color: trainChip.text,
                        }}
                      >
                        🚆 {trip.trainStatus}
                      </span>
                      <span
                        style={{
                          ...styles.chip,
                          backgroundColor: hotelChip.bg,
                          color: hotelChip.text,
                        }}
                      >
                        🛏️ {trip.hotelStatus}
                      </span>
                    </div>
                  </div>
                  <div style={styles.listRight}>
                    <button
                      style={styles.viewButton}
                      onClick={() => navigate(`/itinerary/result/${trip.itineraryId}`)}
                    >
                      View →
                    </button>
                    <div style={styles.iconSquareButton} onClick={handleShare}>
                      ↗
                    </div>
                    <div
                      style={styles.iconSquareButton}
                      onClick={() => handleDelete(trip._id)}
                    >
                      🗑
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredTrips.length > 0 && (
          <button style={styles.loadMoreButton}>Load more trips</button>
        )}
      </div>
    </div>
  );
}
