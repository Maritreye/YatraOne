import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import mockData from "../data/bookingHistory.json";

export default function BookingHistory() {
  const navigate = useNavigate();
  const { mongoUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [monthlySpend] = useState(mockData.monthlySpend);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [activeMenu] = useState("Booking History");
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [expandedRow, setExpandedRow] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!mongoUser?._id) return;
    fetch(`http://localhost:5000/api/bookings/user/${mongoUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoadingBookings(false);
      })
      .catch((err) => {
        console.error("Failed to load bookings:", err);
        setLoadingBookings(false);
      });
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

  const trainCount = bookings.filter((b) => b.type === "Train").length;
  const hotelCount = bookings.filter((b) => b.type === "Hotel").length;

  const tabs = [
    { label: "All Bookings", count: bookings.length },
    { label: "Train Bookings", count: trainCount },
    { label: "Hotel Bookings", count: hotelCount },
  ];

  const statusColors = {
    Redirected: { bg: "#DBEAFE", text: "#1E40AF" },
    Completed: { bg: "#DCFCE7", text: "#166534" },
    Pending: { bg: "#FEF9C3", text: "#854D0E" },
    Cancelled: { bg: "#FEE2E2", text: "#991B1B" },
  };

  const filteredBookings = bookings
    .filter((b) => {
      if (activeTab === "Train Bookings") return b.type === "Train";
      if (activeTab === "Hotel Bookings") return b.type === "Hotel";
      return true;
    })
    .filter((b) => statusFilter === "All Status" || b.status === statusFilter)
    .filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.route.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalTrainSpend = bookings
    .filter((b) => b.type === "Train")
    .reduce((sum, b) => sum + b.amount, 0);
  const totalHotelSpend = bookings
    .filter((b) => b.type === "Hotel")
    .reduce((sum, b) => sum + b.amount, 0);
  const totalSpend = totalTrainSpend + totalHotelSpend;

  const maxMonthly = Math.max(...monthlySpend.map((m) => m.amount));

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExport = () => {
    window.alert("Booking history exported as CSV (demo only).");
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
    exportButton: {
      backgroundColor: "transparent",
      border: "1px solid #2563EB",
      color: "#2563EB",
      borderRadius: 8,
      padding: "10px 18px",
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
      margin: "2px 0 0 0",
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
    filterRow: {
      display: "flex",
      gap: 12,
      marginTop: 20,
      flexWrap: "wrap",
      alignItems: "center",
    },
    searchInput: {
      flex: 1,
      minWidth: 240,
      height: 40,
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "0 14px",
      fontSize: 14,
      color: "#1E293B",
      outline: "none",
    },
    dateInput: {
      width: 160,
      height: 40,
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "0 10px",
      fontSize: 13,
      color: "#1E293B",
    },
    statusDropdown: {
      width: 160,
      height: 40,
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: "0 10px",
      fontSize: 13,
      color: "#1E293B",
      backgroundColor: "#FFFFFF",
    },
    tableCard: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 24,
    },
    tableHeaderRow: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#F8FAFC",
      borderBottom: "1px solid #E2E8F0",
      height: 48,
      padding: "0 24px",
      gap: 12,
    },
    thBookingNum: { width: 130, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" },
    thType: { width: 80, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" },
    thDetails: { flex: 1, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" },
    thDate: { width: 140, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" },
    thAmount: { width: 120, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" },
    thStatus: { width: 130, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" },
    thAction: { width: 100, fontSize: 12, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" },
    tableRow: {
      display: "flex",
      alignItems: "center",
      minHeight: 72,
      borderBottom: "0.5px solid #E2E8F0",
      padding: "12px 24px",
      gap: 12,
      cursor: "pointer",
    },
    tdBookingNum: { width: 130 },
    bookingIdText: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    platformNote: { fontSize: 11, color: "#94A3B8", margin: "2px 0 0 0" },
    tdType: { width: 80, display: "flex", justifyContent: "center" },
    typeIconPill: {
      width: 36,
      height: 36,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    tdDetails: { flex: 1, display: "flex", flexDirection: "column", gap: 3 },
    detailsName: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    detailsRoute: { fontSize: 13, color: "#64748B", margin: 0 },
    detailsBadge: {
      fontSize: 11,
      color: "#475569",
      backgroundColor: "#F1F5F9",
      padding: "2px 8px",
      borderRadius: 8,
      width: "fit-content",
    },
    tdDate: { width: 140 },
    dateText: { fontSize: 14, color: "#1E293B", margin: 0 },
    timeText: { fontSize: 12, color: "#94A3B8", margin: "2px 0 0 0" },
    tdAmount: { width: 120, textAlign: "right" },
    amountText: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    unitText: { fontSize: 11, color: "#94A3B8", margin: "2px 0 0 0" },
    tdStatus: { width: 130, display: "flex", justifyContent: "center" },
    statusPill: {
      fontSize: 12,
      fontWeight: 500,
      padding: "4px 12px",
      borderRadius: 12,
    },
    tdAction: { width: 100, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, position: "relative" },
    viewLink: { fontSize: 13, color: "#2563EB", cursor: "pointer" },
    moreBtn: { fontSize: 16, color: "#94A3B8", cursor: "pointer" },
    moreDropdown: {
      position: "absolute",
      top: 30,
      right: 0,
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      padding: 8,
      width: 160,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 10,
      textAlign: "left",
    },
    dropdownItem: {
      padding: "8px 10px",
      fontSize: 13,
      color: "#1E293B",
      cursor: "pointer",
      borderRadius: 6,
    },
    expandedArea: {
      backgroundColor: "#F8FAFC",
      borderTop: "1px dashed #E2E8F0",
      padding: "20px 24px",
      display: "flex",
      gap: 24,
      flexWrap: "wrap",
    },
    expandedSection: {
      flex: 1,
      minWidth: 200,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    expandedLabel: {
      fontSize: 12,
      color: "#94A3B8",
      margin: 0,
    },
    expandedValue: {
      fontSize: 14,
      fontWeight: 500,
      color: "#1E293B",
      margin: 0,
    },
    expandedActions: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    expandedBlueButton: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    },
    expandedOutlinedButton: {
      backgroundColor: "transparent",
      border: "1px solid #E2E8F0",
      color: "#1E293B",
      borderRadius: 8,
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
    },
    expandedDownloadLink: {
      fontSize: 13,
      color: "#2563EB",
      cursor: "pointer",
      textAlign: "center",
    },
    summaryCard: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: 24,
      marginTop: 24,
    },
    summaryHeading: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      fontSize: 18,
      color: "#1E293B",
      margin: "0 0 16px 0",
    },
    monthRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    monthLabel: { width: 40, fontSize: 13, color: "#64748B" },
    barTrack: {
      flex: 1,
      height: 8,
      backgroundColor: "#E2E8F0",
      borderRadius: 999,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      backgroundColor: "#2563EB",
      borderRadius: 999,
    },
    monthAmount: { width: 80, fontSize: 13, color: "#1E293B", textAlign: "right" },
    categoryHeading: {
      fontSize: 14,
      fontWeight: 500,
      color: "#1E293B",
      margin: "24px 0 10px 0",
    },
    stackedBar: {
      width: "100%",
      height: 12,
      borderRadius: 999,
      display: "flex",
      overflow: "hidden",
      marginBottom: 12,
    },
    legendRow: {
      display: "flex",
      gap: 24,
      flexWrap: "wrap",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      color: "#64748B",
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: "50%",
    },
    totalSpendRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#EFF6FF",
      borderRadius: 8,
      padding: 16,
      marginTop: 20,
    },
    totalSpendLabel: { fontSize: 14, fontWeight: 500, color: "#1E293B" },
    totalSpendAmount: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      fontSize: 20,
      color: "#2563EB",
    },
    emptyState: {
      width: 420,
      margin: "60px auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      textAlign: "center",
    },
    emptyCircle: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      backgroundColor: "#F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      color: "#94A3B8",
    },
    emptyHeading: { fontSize: 20, fontWeight: 500, color: "#1E293B", margin: 0 },
    emptySubtext: { fontSize: 14, color: "#64748B", margin: 0 },
    emptyButtonsRow: { display: "flex", gap: 12 },
    emptyBlueButton: {
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      borderRadius: 8,
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
    emptyOutlinedButton: {
      backgroundColor: "transparent",
      border: "1px solid #2563EB",
      color: "#2563EB",
      borderRadius: 8,
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    },
  };

  if (loadingBookings) return <p style={{ padding: 40 }}>Loading bookings...</p>;

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
            <h1 style={styles.pageTitle}>Booking History</h1>
            <p style={styles.pageSubtext}>Track all your train and hotel booking redirects</p>
          </div>
          <button style={styles.exportButton} onClick={handleExport}>
            ⬇ Export History
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconCircle, backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
              🎫
            </div>
            <p style={styles.statNumber}>{bookings.length}</p>
            <p style={styles.statLabel}>Total Bookings</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconCircle, backgroundColor: "#CCFBF1", color: "#0F766E" }}>
              🚆
            </div>
            <p style={styles.statNumber}>{trainCount}</p>
            <p style={styles.statLabel}>Train Bookings</p>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconCircle, backgroundColor: "#FEF9C3", color: "#854D0E" }}>
              🛏️
            </div>
            <p style={styles.statNumber}>{hotelCount}</p>
            <p style={styles.statLabel}>Hotel Bookings</p>
          </div>
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

        <div style={styles.filterRow}>
          <input
            style={styles.searchInput}
            placeholder="Search by train, hotel or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="date"
            style={styles.dateInput}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            style={styles.dateInput}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <select
            style={styles.statusDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Redirected</option>
            <option>Cancelled</option>
          </select>
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyCircle}>🎫</div>
            <h2 style={styles.emptyHeading}>No booking history yet</h2>
            <p style={styles.emptySubtext}>
              Your train and hotel booking redirects will appear here
            </p>
            <div style={styles.emptyButtonsRow}>
              <button style={styles.emptyBlueButton} onClick={() => navigate("/trains")}>
                Search Trains →
              </button>
              <button style={styles.emptyOutlinedButton} onClick={() => navigate("/hotels")}>
                Find Hotels →
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <div style={styles.tableHeaderRow}>
              <div style={styles.thBookingNum}>Booking #</div>
              <div style={styles.thType}>Type</div>
              <div style={styles.thDetails}>Details</div>
              <div style={styles.thDate}>Date</div>
              <div style={styles.thAmount}>Amount</div>
              <div style={styles.thStatus}>Status</div>
              <div style={styles.thAction}>Action</div>
            </div>

            {filteredBookings.map((b) => {
              const sc = statusColors[b.status];
              const isExpanded = expandedRow === b._id;
              const isTrain = b.type === "Train";
              return (
                <div key={b._id}>
                  <div
                    style={styles.tableRow}
                    onClick={() => setExpandedRow(isExpanded ? null : b._id)}
                  >
                    <div style={styles.tdBookingNum}>
                      <p style={styles.bookingIdText}>#{b.bookingCode}</p>
                      <p style={styles.platformNote}>{b.platform}</p>
                    </div>
                    <div style={styles.tdType}>
                      <div
                        style={{
                          ...styles.typeIconPill,
                          backgroundColor: isTrain ? "#DBEAFE" : "#CCFBF1",
                          color: isTrain ? "#1E40AF" : "#0F766E",
                        }}
                      >
                        {isTrain ? "🚆" : "🛏️"}
                      </div>
                    </div>
                    <div style={styles.tdDetails}>
                      <p style={styles.detailsName}>{b.name}</p>
                      <p style={styles.detailsRoute}>{b.route}</p>
                      <span style={styles.detailsBadge}>{b.classOrRoom}</span>
                    </div>
                    <div style={styles.tdDate}>
                      <p style={styles.dateText}>{b.date}</p>
                      <p style={styles.timeText}>{b.time}</p>
                    </div>
                    <div style={styles.tdAmount}>
                      <p style={styles.amountText}>₹{b.amount.toLocaleString()}</p>
                      <p style={styles.unitText}>{b.unit}</p>
                    </div>
                    <div style={styles.tdStatus}>
                      <span
                        style={{
                          ...styles.statusPill,
                          backgroundColor: sc?.bg || "#F1F5F9",
                          color: sc?.text || "#475569",
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div style={styles.tdAction}>
                      <span
                        style={styles.viewLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(isExpanded ? null : b._id);
                        }}
                      >
                        View →
                      </span>
                      <span
                        style={styles.moreBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === b._id ? null : b._id);
                        }}
                      >
                        ⋯
                      </span>
                      {openMenuId === b._id && (
                        <div style={styles.moreDropdown} onClick={(e) => e.stopPropagation()}>
                          <div
                            style={styles.dropdownItem}
                            onClick={() =>
                              openExternal(
                                isTrain
                                  ? "https://www.irctc.co.in/nget/train-search"
                                  : "https://www.makemytrip.com/hotels/"
                              )
                            }
                          >
                            ↗ Open {isTrain ? "IRCTC" : "MakeMyTrip"}
                          </div>
                          <div style={styles.dropdownItem}>⬇ Download details</div>
                          <div style={styles.dropdownItem}>+ Add to trip</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && isTrain && (
                    <div style={styles.expandedArea}>
                      <div style={styles.expandedSection}>
                        <p style={styles.expandedLabel}>Journey details</p>
                        <p style={styles.expandedValue}>{b.details?.fullRoute}</p>
                        <p style={styles.expandedLabel}>
                          Departure: {b.details?.departure} · Arrival: {b.details?.arrival}
                        </p>
                        <p style={styles.expandedLabel}>Duration: {b.details?.duration}</p>
                        <p style={styles.expandedLabel}>Class: {b.details?.classFull}</p>
                        <p style={styles.expandedLabel}>PNR available on IRCTC</p>
                      </div>
                      <div style={styles.expandedSection}>
                        <p style={styles.expandedLabel}>Passenger details</p>
                        <p style={styles.expandedValue}>Travellers: {b.details?.travellers}</p>
                        <p style={styles.expandedValue}>
                          Total fare: ₹{b.details?.totalFare?.toLocaleString()}
                        </p>
                        <p style={styles.expandedLabel}>Booking platform: IRCTC</p>
                      </div>
                      <div style={styles.expandedSection}>
                        <div style={styles.expandedActions}>
                          <button
                            style={styles.expandedBlueButton}
                            onClick={() =>
                              openExternal("https://www.irctc.co.in/nget/train-search")
                            }
                          >
                            Open IRCTC ↗
                          </button>
                          <button
                            style={styles.expandedOutlinedButton}
                            onClick={() => navigate("/itinerary")}
                          >
                            Add to trip
                          </button>
                          <span style={styles.expandedDownloadLink}>Download details</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isExpanded && !isTrain && (
                    <div style={styles.expandedArea}>
                      <div style={styles.expandedSection}>
                        <p style={styles.expandedLabel}>Stay details</p>
                        <p style={styles.expandedValue}>Check in: {b.details?.checkIn}</p>
                        <p style={styles.expandedValue}>Check out: {b.details?.checkOut}</p>
                        <p style={styles.expandedLabel}>Duration: {b.details?.nights} nights</p>
                        <p style={styles.expandedLabel}>Room: {b.details?.room}</p>
                        <p style={styles.expandedLabel}>Guests: {b.details?.guests}</p>
                      </div>
                      <div style={styles.expandedSection}>
                        <p style={styles.expandedLabel}>Price breakdown</p>
                        <p style={styles.expandedValue}>
                          Room per night: ₹{b.details?.perNight?.toLocaleString()}
                        </p>
                        <p style={styles.expandedLabel}>Nights: {b.details?.nights}</p>
                        <p style={styles.expandedValue}>
                          Subtotal: ₹{b.details?.subtotal?.toLocaleString()}
                        </p>
                        <p style={styles.expandedLabel}>Taxes: included</p>
                        <p style={styles.expandedLabel}>Platform: MakeMyTrip</p>
                      </div>
                      <div style={styles.expandedSection}>
                        <div style={styles.expandedActions}>
                          <button
                            style={styles.expandedBlueButton}
                            onClick={() => openExternal("https://www.makemytrip.com/hotels/")}
                          >
                            Open MakeMyTrip ↗
                          </button>
                          <button
                            style={styles.expandedOutlinedButton}
                            onClick={() => navigate("/hotels")}
                          >
                            View hotel
                          </button>
                          <span style={styles.expandedDownloadLink}>Download details</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.summaryCard}>
          <h2 style={styles.summaryHeading}>Spending summary</h2>
          {monthlySpend.map((m, i) => (
            <div style={styles.monthRow} key={i}>
              <span style={styles.monthLabel}>{m.month}</span>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${(m.amount / maxMonthly) * 100}%`,
                  }}
                ></div>
              </div>
              <span style={styles.monthAmount}>₹{m.amount.toLocaleString()}</span>
            </div>
          ))}

          <h3 style={styles.categoryHeading}>Spending by category</h3>
          <div style={styles.stackedBar}>
            <div
              style={{
                width: `${totalSpend > 0 ? (totalTrainSpend / totalSpend) * 100 : 50}%`,
                backgroundColor: "#2563EB",
              }}
            ></div>
            <div
              style={{
                width: `${totalSpend > 0 ? (totalHotelSpend / totalSpend) * 100 : 50}%`,
                backgroundColor: "#0F766E",
              }}
            ></div>
          </div>
          <div style={styles.legendRow}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: "#2563EB" }}></span>
              <span>Train ₹{totalTrainSpend.toLocaleString()}</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: "#0F766E" }}></span>
              <span>Hotel ₹{totalHotelSpend.toLocaleString()}</span>
            </div>
          </div>

          <div style={styles.totalSpendRow}>
            <span style={styles.totalSpendLabel}>Total spent via YatraOne</span>
            <span style={styles.totalSpendAmount}>₹{totalSpend.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
