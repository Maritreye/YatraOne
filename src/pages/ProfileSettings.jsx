import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { mongoUser } = useAuth();
  const [activeMenu] = useState("Settings");
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [showToast, setShowToast] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = React.useRef(null);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [newPassword, setNewPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const displayName = mongoUser?.name || "Loading...";
  const initials = mongoUser?.name
    ? mongoUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const [formData, setFormData] = useState({
    firstName: mongoUser?.name?.split(" ")[0] || "",
    lastName: mongoUser?.name?.split(" ").slice(1).join(" ") || "",
    email: mongoUser?.email || "",
    phone: mongoUser?.phone || "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    tripReminders: true,
    bookingUpdates: true,
    aiItinerary: true,
    priceAlerts: false,
    newDestinations: false,
    weeklyDigest: false,
    promotional: false,
  });

  const [channels, setChannels] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "Public",
    tripVisibility: "Only me",
    searchHistory: true,
    locationAccess: true,
    dataAnalytics: false,
  });

  const [accommodationType, setAccommodationType] = useState("3 Star Hotels");
  const [travelStyle, setTravelStyle] = useState("Balanced");

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

  const settingsTabs = [
    "Personal Info",
    "Security",
    "Notifications",
    "Privacy",
    "Connected Accounts",
    "Danger Zone",
  ];

  const sessions = [
    { device: "💻", name: "Chrome · Windows 11", location: "Varanasi, India · Active now", current: true },
    { device: "📱", name: "Safari · iPhone", location: "Mumbai, India · 2 days ago", current: false },
    { device: "💻", name: "Firefox · Mac", location: "Delhi, India · 5 days ago", current: false },
  ];

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLabel = ["Weak", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = ["#EF4444", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"][strengthScore];

  const connectedAccounts = [
    { name: "Google", letter: "G", bg: "#FEE2E2", color: "#DC2626", connected: true, email: mongoUser?.email || "" },
    { name: "Facebook", letter: "f", bg: "#DBEAFE", color: "#1D4ED8", connected: false },
    { name: "Apple", letter: "", bg: "#F1F5F9", color: "#1E293B", connected: false },
  ];

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChannel = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacyBool = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      window.alert("Account deletion confirmed (demo only — no data was actually deleted).");
      setShowDeleteModal(false);
      setDeleteConfirmText("");
      navigate("/login");
    }
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
    profileSection: { padding: 24, display: "flex", flexDirection: "column", gap: 8 },
    avatarSmall: {
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
    userName: { fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 16, color: "#1E293B", margin: 0 },
    userEmail: { fontSize: 13, color: "#94A3B8", margin: 0 },
    editProfileLink: { fontSize: 12, color: "#2563EB", cursor: "pointer", marginTop: 4 },
    sidebarDivider: { height: 1, backgroundColor: "#E2E8F0", margin: "8px 0" },
    navMenu: { display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" },
    menuItem: {
      display: "flex", alignItems: "center", gap: 12, height: 44, borderRadius: 8,
      padding: "0 16px", cursor: "pointer", fontSize: 14, fontWeight: 500,
      color: "#64748B", backgroundColor: "transparent", borderLeft: "3px solid transparent",
    },
    menuItemActive: { backgroundColor: "#EFF6FF", color: "#2563EB", borderLeft: "3px solid #2563EB" },
    sidebarBottom: { padding: 16 },
    logoutRow: {
      display: "flex", alignItems: "center", gap: 12, height: 44, padding: "0 16px",
      color: "#EF4444", fontWeight: 500, fontSize: 14, cursor: "pointer",
    },
    versionText: { fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 8 },
    mainContent: { flex: 1, padding: 32, minWidth: 0 },
    pageTitle: { fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 28, color: "#1E293B", margin: 0 },
    pageSubtext: { fontSize: 14, color: "#64748B", margin: "4px 0 0 0" },
    settingsLayout: { display: "flex", gap: 32, marginTop: 24, alignItems: "flex-start" },
    miniNav: { width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 },
    miniNavTab: {
      height: 40, borderRadius: 8, padding: "0 14px", fontSize: 14, fontWeight: 500,
      display: "flex", alignItems: "center", color: "#64748B", cursor: "pointer",
      borderLeft: "3px solid transparent",
    },
    miniNavTabActive: { backgroundColor: "#EFF6FF", color: "#2563EB", borderLeft: "3px solid #2563EB" },
    contentPanel: { flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
    card: { backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 },
    dangerCard: { backgroundColor: "#FFFFFF", border: "1px solid #FCA5A5", borderRadius: 12, padding: 24 },
    cardHeading: { fontSize: 16, fontWeight: 500, color: "#1E293B", margin: 0 },
    dangerHeading: { fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 16, color: "#991B1B", margin: 0 },
    cardDivider: { height: 1, backgroundColor: "#E2E8F0", margin: "16px 0" },
    profilePhotoRow: { display: "flex", alignItems: "center", gap: 24 },
    avatarLarge: {
      width: 80, height: 80, borderRadius: "50%", backgroundColor: "#DBEAFE", color: "#1E40AF",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, position: "relative", flexShrink: 0,
      overflow: "hidden",
    },
    cameraBadge: {
      position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%",
      backgroundColor: "#2563EB", color: "#FFFFFF", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 11, border: "2px solid #FFFFFF",
    },
    profileInfoBlock: { display: "flex", flexDirection: "column", gap: 8 },
    profileNameText: { fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 18, color: "#1E293B", margin: 0 },
    profileEmailText: { fontSize: 14, color: "#64748B", margin: 0 },
    photoButtonsRow: { display: "flex", gap: 8, alignItems: "center", marginTop: 4 },
    uploadButton: {
      backgroundColor: "transparent", border: "1px solid #2563EB", color: "#2563EB",
      borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
    },
    removePhotoLink: { fontSize: 13, color: "#EF4444", cursor: "pointer" },
    formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
    fieldLabel: { fontSize: 14, fontWeight: 500, color: "#1E293B" },
    fieldInput: {
      height: 44, border: "1px solid #E2E8F0", borderRadius: 8, padding: "0 14px",
      fontSize: 14, color: "#1E293B", outline: "none", width: "100%", boxSizing: "border-box",
    },
    emailFieldRow: { display: "flex", gap: 8, alignItems: "center" },
    verifiedBadge: {
      backgroundColor: "#DCFCE7", color: "#166534", borderRadius: 20, padding: "5px 12px",
      fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
    },
    textarea: {
      border: "1px solid #E2E8F0", borderRadius: 8, padding: 12, fontSize: 14,
      color: "#1E293B", minHeight: 80, resize: "vertical", fontFamily: "Inter, sans-serif",
      width: "100%", boxSizing: "border-box", outline: "none",
    },
    charCount: { fontSize: 12, color: "#94A3B8", textAlign: "right", marginTop: 4 },
    saveRow: { display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center", marginTop: 8 },
    cancelLink: { fontSize: 14, color: "#64748B", cursor: "pointer" },
    saveButton: {
      backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 8,
      padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer",
    },
    toast: {
      position: "fixed", bottom: 24, right: 24, backgroundColor: "#DCFCE7", color: "#166534",
      padding: "14px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100,
    },
    passwordFieldWrap: { position: "relative" },
    eyeIcon: {
      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
      cursor: "pointer", fontSize: 14, color: "#94A3B8",
    },
    strengthBarTrack: { width: "100%", height: 6, backgroundColor: "#E2E8F0", borderRadius: 999, marginTop: 8, overflow: "hidden" },
    strengthBarFill: { height: "100%", borderRadius: 999 },
    strengthLabel: { fontSize: 12, marginTop: 6, fontWeight: 500 },
    requirementsList: { display: "flex", flexDirection: "column", gap: 6, marginTop: 12 },
    requirementRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
    updatePasswordButton: {
      backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 8,
      padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", alignSelf: "flex-end", marginTop: 16,
    },
    statusRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    statusText: { fontSize: 14, color: "#1E293B" },
    toggleSwitch: {
      width: 44, height: 24, borderRadius: 999, position: "relative", cursor: "pointer",
      transition: "background-color 0.2s", flexShrink: 0,
    },
    toggleCircle: {
      width: 20, height: 20, borderRadius: "50%", backgroundColor: "#FFFFFF",
      position: "absolute", top: 2, transition: "left 0.2s",
    },
    descriptionText: { fontSize: 13, color: "#64748B", margin: "8px 0 0 0" },
    sessionRow: {
      display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9",
    },
    sessionIconCircle: {
      width: 40, height: 40, borderRadius: "50%", backgroundColor: "#F1F5F9",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
    },
    sessionCenter: { flex: 1, marginLeft: 12 },
    sessionName: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    sessionMeta: { fontSize: 12, color: "#94A3B8", margin: "2px 0 0 0" },
    currentBadge: {
      backgroundColor: "#DCFCE7", color: "#166534", fontSize: 12, fontWeight: 500,
      padding: "4px 10px", borderRadius: 10,
    },
    sessionLogoutLink: { fontSize: 13, color: "#EF4444", cursor: "pointer" },
    logoutAllButton: {
      width: "100%", backgroundColor: "transparent", border: "1px solid #EF4444", color: "#EF4444",
      borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 16,
    },
    notifRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" },
    notifLeft: { display: "flex", flexDirection: "column", gap: 2 },
    notifName: { fontSize: 14, fontWeight: 500, color: "#1E293B" },
    notifDesc: { fontSize: 13, color: "#64748B" },
    dropdownSelect: {
      width: 180, height: 40, border: "1px solid #E2E8F0", borderRadius: 8,
      padding: "0 10px", fontSize: 13, color: "#1E293B", backgroundColor: "#FFFFFF",
    },
    dataRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" },
    dataLinkBlue: { fontSize: 13, color: "#2563EB", cursor: "pointer", fontWeight: 500 },
    dataLinkRed: { fontSize: 13, color: "#EF4444", cursor: "pointer", fontWeight: 500 },
    accountRow: { display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" },
    accountLogo: {
      width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0,
    },
    accountCenter: { flex: 1, marginLeft: 14 },
    accountName: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    accountStatus: { fontSize: 13, color: "#64748B", margin: "2px 0 0 0" },
    connectButton: {
      backgroundColor: "transparent", border: "1px solid #2563EB", color: "#2563EB",
      borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
    },
    disconnectButton: {
      backgroundColor: "transparent", border: "1px solid #EF4444", color: "#EF4444",
      borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
    },
    chipsRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    chip: {
      padding: "8px 14px", borderRadius: 20, fontSize: 13, border: "1px solid #E2E8F0",
      cursor: "pointer", backgroundColor: "#FFFFFF", color: "#475569",
    },
    chipActive: { backgroundColor: "#2563EB", color: "#FFFFFF", border: "1px solid #2563EB" },
    prefRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F1F5F9" },
    dangerSubtext: { fontSize: 14, color: "#64748B", margin: "4px 0 0 0" },
    dangerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #FEE2E2" },
    dangerRowHeading: { fontSize: 14, fontWeight: 500, color: "#1E293B", margin: 0 },
    dangerRowSub: { fontSize: 13, color: "#64748B", margin: "2px 0 0 0" },
    outlinedRedButton: {
      backgroundColor: "transparent", border: "1px solid #EF4444", color: "#EF4444",
      borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", flexShrink: 0,
    },
    filledRedButton: {
      backgroundColor: "#EF4444", color: "#FFFFFF", border: "none", borderRadius: 8,
      padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", flexShrink: 0,
    },
    modalOverlay: {
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    },
    modalCard: {
      width: 480, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 32,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center",
    },
    warningIconCircle: {
      width: 56, height: 56, borderRadius: "50%", backgroundColor: "#FEE2E2",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
    },
    modalHeading: { fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#1E293B", margin: 0 },
    modalBody: { fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: 0 },
    modalInput: {
      width: "100%", height: 44, border: "1px solid #E2E8F0", borderRadius: 8,
      padding: "0 14px", fontSize: 14, color: "#1E293B", boxSizing: "border-box", outline: "none",
    },
    modalButtonRow: { display: "flex", gap: 12, width: "100%", marginTop: 8 },
    modalCancelButton: {
      flex: 1, backgroundColor: "transparent", border: "1px solid #E2E8F0", color: "#1E293B",
      borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer",
    },
    modalDeleteButton: {
      flex: 1, backgroundColor: "#EF4444", color: "#FFFFFF", border: "none", borderRadius: 8,
      padding: "12px 0", fontSize: 14, fontWeight: 500, cursor: "pointer",
    },
  };

  const Toggle = ({ on, onClick }) => (
    <div
      style={{ ...styles.toggleSwitch, backgroundColor: on ? "#2563EB" : "#E2E8F0" }}
      onClick={onClick}
    >
      <div style={{ ...styles.toggleCircle, left: on ? 22 : 2 }}></div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <div style={styles.profileSection}>
            <div style={styles.avatarSmall}>{initials}</div>
            <p style={styles.userName}>{displayName}</p>
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
        <h1 style={styles.pageTitle}>Profile Settings</h1>
        <p style={styles.pageSubtext}>Manage your account and preferences</p>

        <div style={styles.settingsLayout}>
          <div style={styles.miniNav}>
            {settingsTabs.map((tab) => (
              <div
                key={tab}
                style={
                  activeTab === tab
                    ? { ...styles.miniNavTab, ...styles.miniNavTabActive }
                    : styles.miniNavTab
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div style={styles.contentPanel}>
            {activeTab === "Personal Info" && (
              <>
                <div style={styles.card}>
                  <div style={styles.profilePhotoRow}>
                    <div style={styles.avatarLarge}>
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        initials
                      )}
                      <div style={styles.cameraBadge}>📷</div>
                    </div>
                    <div style={styles.profileInfoBlock}>
                      <p style={styles.profileNameText}>{displayName}</p>
                      <p style={styles.profileEmailText}>{mongoUser?.email || ""}</p>
                      <div style={styles.photoButtonsRow}>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePhotoSelect}
                          style={{ display: "none" }}
                        />
                        <button
                          style={styles.uploadButton}
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          ⬆ Upload photo
                        </button>
                        <span style={styles.removePhotoLink} onClick={handleRemovePhoto}>
                          Remove photo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Personal information</h2>
                  <div style={styles.cardDivider}></div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={styles.formGrid2}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>First Name</label>
                        <input
                          style={styles.fieldInput}
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Last Name</label>
                        <input
                          style={styles.fieldInput}
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={styles.formGrid2}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Email</label>
                        <div style={styles.emailFieldRow}>
                          <input style={styles.fieldInput} value={formData.email} readOnly />
                          <span style={styles.verifiedBadge}>✓ Verified</span>
                        </div>
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Phone</label>
                        <input
                          style={styles.fieldInput}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={styles.formGrid2}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Date of Birth</label>
                        <input
                          type="date"
                          style={styles.fieldInput}
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Gender</label>
                        <select
                          style={styles.fieldInput}
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.formGrid2}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>City</label>
                        <input
                          style={styles.fieldInput}
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>State</label>
                        <select
                          style={styles.fieldInput}
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option>Uttar Pradesh</option>
                          <option>Rajasthan</option>
                          <option>Delhi</option>
                          <option>Maharashtra</option>
                          <option>West Bengal</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.fieldLabel}>Bio / About yourself</label>
                      <textarea
                        style={styles.textarea}
                        placeholder="Tell us about yourself..."
                        maxLength={200}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      ></textarea>
                      <span style={styles.charCount}>{formData.bio.length}/200</span>
                    </div>
                  </div>

                  <div style={styles.saveRow}>
                    <span style={styles.cancelLink}>Cancel</span>
                    <button style={styles.saveButton} onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security" && (
              <>
                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Change password</h2>
                  <div style={styles.cardDivider}></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.fieldLabel}>Current password</label>
                      <div style={styles.passwordFieldWrap}>
                        <input
                          type={showPassword.current ? "text" : "password"}
                          style={styles.fieldInput}
                          placeholder="Enter current password"
                        />
                        <span
                          style={styles.eyeIcon}
                          onClick={() =>
                            setShowPassword({ ...showPassword, current: !showPassword.current })
                          }
                        >
                          {showPassword.current ? "🙈" : "👁"}
                        </span>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.fieldLabel}>New password</label>
                      <div style={styles.passwordFieldWrap}>
                        <input
                          type={showPassword.new ? "text" : "password"}
                          style={styles.fieldInput}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                          style={styles.eyeIcon}
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        >
                          {showPassword.new ? "🙈" : "👁"}
                        </span>
                      </div>
                      {newPassword.length > 0 && (
                        <>
                          <div style={styles.strengthBarTrack}>
                            <div
                              style={{
                                ...styles.strengthBarFill,
                                width: `${(strengthScore / 4) * 100}%`,
                                backgroundColor: strengthColor,
                              }}
                            ></div>
                          </div>
                          <span style={{ ...styles.strengthLabel, color: strengthColor }}>
                            {strengthLabel}
                          </span>
                        </>
                      )}
                      <div style={styles.requirementsList}>
                        <div style={styles.requirementRow}>
                          <span style={{ color: passwordChecks.length ? "#166534" : "#94A3B8" }}>
                            {passwordChecks.length ? "✓" : "✕"}
                          </span>
                          <span style={{ color: passwordChecks.length ? "#166534" : "#94A3B8" }}>
                            Minimum 8 characters
                          </span>
                        </div>
                        <div style={styles.requirementRow}>
                          <span style={{ color: passwordChecks.uppercase ? "#166534" : "#94A3B8" }}>
                            {passwordChecks.uppercase ? "✓" : "✕"}
                          </span>
                          <span style={{ color: passwordChecks.uppercase ? "#166534" : "#94A3B8" }}>
                            At least one uppercase letter
                          </span>
                        </div>
                        <div style={styles.requirementRow}>
                          <span style={{ color: passwordChecks.number ? "#166534" : "#94A3B8" }}>
                            {passwordChecks.number ? "✓" : "✕"}
                          </span>
                          <span style={{ color: passwordChecks.number ? "#166534" : "#94A3B8" }}>
                            At least one number
                          </span>
                        </div>
                        <div style={styles.requirementRow}>
                          <span style={{ color: passwordChecks.special ? "#166534" : "#94A3B8" }}>
                            {passwordChecks.special ? "✓" : "✕"}
                          </span>
                          <span style={{ color: passwordChecks.special ? "#166534" : "#94A3B8" }}>
                            At least one special character
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.fieldLabel}>Confirm new password</label>
                      <div style={styles.passwordFieldWrap}>
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          style={styles.fieldInput}
                          placeholder="Re-enter new password"
                        />
                        <span
                          style={styles.eyeIcon}
                          onClick={() =>
                            setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                          }
                        >
                          {showPassword.confirm ? "🙈" : "👁"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button style={styles.updatePasswordButton} onClick={handleSave}>
                    Update Password
                  </button>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Two-factor authentication</h2>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.statusRow}>
                    <span style={styles.statusText}>
                      2FA is currently {twoFA ? "enabled" : "disabled"}
                    </span>
                    <Toggle on={twoFA} onClick={() => setTwoFA(!twoFA)} />
                  </div>
                  <p style={styles.descriptionText}>
                    Add an extra layer of security to your account
                  </p>
                  {twoFA && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: 16,
                        backgroundColor: "#F8FAFC",
                        borderRadius: 8,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 140,
                          height: 140,
                          backgroundColor: "#E2E8F0",
                          margin: "0 auto 12px auto",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "#64748B",
                        }}
                      >
                        QR Code
                      </div>
                      <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                        Scan this QR code with your authenticator app to complete setup
                      </p>
                    </div>
                  )}
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Active sessions</h2>
                  <p style={styles.descriptionText}>Devices currently logged in to your account</p>
                  <div style={styles.cardDivider}></div>
                  {sessions.map((s, i) => (
                    <div style={styles.sessionRow} key={i}>
                      <div style={styles.sessionIconCircle}>{s.device}</div>
                      <div style={styles.sessionCenter}>
                        <p style={styles.sessionName}>{s.name}</p>
                        <p style={styles.sessionMeta}>{s.location}</p>
                      </div>
                      {s.current ? (
                        <span style={styles.currentBadge}>Current</span>
                      ) : (
                        <span style={styles.sessionLogoutLink}>Logout</span>
                      )}
                    </div>
                  ))}
                  <button style={styles.logoutAllButton}>Logout all other devices</button>
                </div>
              </>
            )}

            {activeTab === "Notifications" && (
              <>
                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Notification preferences</h2>
                  <div style={styles.cardDivider}></div>
                  {[
                    { key: "tripReminders", name: "Trip reminders", desc: "Get reminded before your trip" },
                    { key: "bookingUpdates", name: "Booking updates", desc: "Updates on your bookings" },
                    { key: "aiItinerary", name: "AI itinerary ready", desc: "When your AI plan is generated" },
                    { key: "priceAlerts", name: "Price alerts", desc: "When train or hotel prices change" },
                    { key: "newDestinations", name: "New destinations", desc: "Discover new travel destinations" },
                    { key: "weeklyDigest", name: "Weekly digest", desc: "Weekly travel inspiration email" },
                    { key: "promotional", name: "Promotional offers", desc: "Deals and special offers" },
                  ].map((n, i) => (
                    <div style={styles.notifRow} key={i}>
                      <div style={styles.notifLeft}>
                        <span style={styles.notifName}>{n.name}</span>
                        <span style={styles.notifDesc}>{n.desc}</span>
                      </div>
                      <Toggle on={notifications[n.key]} onClick={() => toggleNotif(n.key)} />
                    </div>
                  ))}
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Notification channels</h2>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.notifRow}>
                    <span style={styles.notifName}>Email notifications</span>
                    <Toggle on={channels.email} onClick={() => toggleChannel("email")} />
                  </div>
                  <div style={styles.notifRow}>
                    <span style={styles.notifName}>Push notifications</span>
                    <Toggle on={channels.push} onClick={() => toggleChannel("push")} />
                  </div>
                  <div style={{ ...styles.notifRow, borderBottom: "none" }}>
                    <span style={styles.notifName}>SMS notifications</span>
                    <Toggle on={channels.sms} onClick={() => toggleChannel("sms")} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Privacy" && (
              <>
                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Privacy settings</h2>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.notifRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Profile visibility</span>
                      <span style={styles.notifDesc}>Who can see your profile</span>
                    </div>
                    <select
                      style={styles.dropdownSelect}
                      value={privacy.profileVisibility}
                      onChange={(e) =>
                        setPrivacy({ ...privacy, profileVisibility: e.target.value })
                      }
                    >
                      <option>Public</option>
                      <option>Friends</option>
                      <option>Only me</option>
                    </select>
                  </div>
                  <div style={styles.notifRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Trip visibility</span>
                      <span style={styles.notifDesc}>Who can see your trips</span>
                    </div>
                    <select
                      style={styles.dropdownSelect}
                      value={privacy.tripVisibility}
                      onChange={(e) => setPrivacy({ ...privacy, tripVisibility: e.target.value })}
                    >
                      <option>Only me</option>
                      <option>Friends</option>
                    </select>
                  </div>
                  <div style={styles.notifRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Search history</span>
                      <span style={styles.notifDesc}>Save my search history</span>
                    </div>
                    <Toggle on={privacy.searchHistory} onClick={() => togglePrivacyBool("searchHistory")} />
                  </div>
                  <div style={styles.notifRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Location access</span>
                      <span style={styles.notifDesc}>Allow location for nearby places</span>
                    </div>
                    <Toggle on={privacy.locationAccess} onClick={() => togglePrivacyBool("locationAccess")} />
                  </div>
                  <div style={{ ...styles.notifRow, borderBottom: "none" }}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Data analytics</span>
                      <span style={styles.notifDesc}>Help improve YatraOne with usage data</span>
                    </div>
                    <Toggle on={privacy.dataAnalytics} onClick={() => togglePrivacyBool("dataAnalytics")} />
                  </div>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Your data</h2>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.dataRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Download your data</span>
                      <span style={styles.notifDesc}>Export all your YatraOne data</span>
                    </div>
                    <span style={styles.dataLinkBlue} onClick={() => window.alert("Preparing your data export (demo only).")}>
                      Download →
                    </span>
                  </div>
                  <div style={styles.dataRow}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Clear search history</span>
                      <span style={styles.notifDesc}>Remove all saved searches</span>
                    </div>
                    <span style={styles.dataLinkRed} onClick={() => window.confirm("Clear all search history?")}>
                      Clear →
                    </span>
                  </div>
                  <div style={{ ...styles.dataRow, borderBottom: "none" }}>
                    <div style={styles.notifLeft}>
                      <span style={styles.notifName}>Clear saved places</span>
                      <span style={styles.notifDesc}>Remove all saved places</span>
                    </div>
                    <span style={styles.dataLinkRed} onClick={() => window.confirm("Clear all saved places?")}>
                      Clear →
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Connected Accounts" && (
              <>
                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Connected accounts</h2>
                  <p style={styles.descriptionText}>Link accounts for quick login and data sync</p>
                  <div style={styles.cardDivider}></div>
                  {connectedAccounts.map((acc, i) => (
                    <div
                      style={
                        i === connectedAccounts.length - 1
                          ? { ...styles.accountRow, borderBottom: "none" }
                          : styles.accountRow
                      }
                      key={i}
                    >
                      <div style={{ ...styles.accountLogo, backgroundColor: acc.bg, color: acc.color }}>
                        {acc.name === "Apple" ? "" : acc.letter}
                      </div>
                      <div style={styles.accountCenter}>
                        <p style={styles.accountName}>{acc.name}</p>
                        <p style={styles.accountStatus}>
                          {acc.connected ? `Connected as ${acc.email}` : "Not connected"}
                        </p>
                      </div>
                      {acc.connected ? (
                        <button style={styles.disconnectButton}>Disconnect</button>
                      ) : (
                        <button style={styles.connectButton}>Connect</button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardHeading}>Travel preferences</h2>
                  <p style={styles.descriptionText}>
                    These help AI generate better itineraries for you
                  </p>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.prefRow}>
                    <span style={styles.notifName}>Preferred seat type</span>
                    <select style={styles.dropdownSelect} defaultValue="Window seat">
                      <option>Window seat</option>
                      <option>Aisle seat</option>
                      <option>No preference</option>
                    </select>
                  </div>
                  <div style={styles.prefRow}>
                    <span style={styles.notifName}>Meal preference</span>
                    <select style={styles.dropdownSelect} defaultValue="Vegetarian">
                      <option>Vegetarian</option>
                      <option>Non-vegetarian</option>
                      <option>Vegan</option>
                      <option>Jain</option>
                    </select>
                  </div>
                  <div style={styles.prefRow}>
                    <span style={styles.notifName}>Accommodation type</span>
                    <div style={styles.chipsRow}>
                      {["Budget", "3 Star Hotels", "5 Star Hotels"].map((c) => (
                        <span
                          key={c}
                          style={
                            accommodationType === c
                              ? { ...styles.chip, ...styles.chipActive }
                              : styles.chip
                          }
                          onClick={() => setAccommodationType(c)}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.prefRow}>
                    <span style={styles.notifName}>Travel style</span>
                    <div style={styles.chipsRow}>
                      {["Relaxed", "Balanced", "Packed"].map((c) => (
                        <span
                          key={c}
                          style={
                            travelStyle === c
                              ? { ...styles.chip, ...styles.chipActive }
                              : styles.chip
                          }
                          onClick={() => setTravelStyle(c)}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ ...styles.prefRow, borderBottom: "none" }}>
                    <span style={styles.notifName}>Language</span>
                    <select style={styles.dropdownSelect} defaultValue="English + Hindi">
                      <option>English + Hindi</option>
                      <option>English only</option>
                      <option>Hindi only</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Danger Zone" && (
              <div style={styles.dangerCard}>
                <h2 style={styles.dangerHeading}>Danger Zone</h2>
                <p style={styles.dangerSubtext}>
                  These actions are permanent and cannot be undone
                </p>
                <div style={styles.cardDivider}></div>

                <div style={styles.dangerRow}>
                  <div>
                    <p style={styles.dangerRowHeading}>Deactivate account</p>
                    <p style={styles.dangerRowSub}>Temporarily disable your account</p>
                  </div>
                  <button
                    style={styles.outlinedRedButton}
                    onClick={() => window.confirm("Deactivate your account?")}
                  >
                    Deactivate
                  </button>
                </div>

                <div style={styles.dangerRow}>
                  <div>
                    <p style={styles.dangerRowHeading}>Delete account</p>
                    <p style={styles.dangerRowSub}>Permanently delete all your data</p>
                  </div>
                  <button
                    style={styles.filledRedButton}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete account
                  </button>
                </div>

                <div style={{ ...styles.dangerRow, borderBottom: "none" }}>
                  <div>
                    <p style={styles.dangerRowHeading}>Clear all data</p>
                    <p style={styles.dangerRowSub}>
                      Remove all trips, bookings and preferences
                    </p>
                  </div>
                  <button
                    style={styles.outlinedRedButton}
                    onClick={() => window.confirm("Clear all your data?")}
                  >
                    Clear data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <div style={styles.toast}>
          <span>✓</span>
          <span>Profile updated successfully</span>
        </div>
      )}

      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.warningIconCircle}>⚠️</div>
            <h2 style={styles.modalHeading}>Delete your account?</h2>
            <p style={styles.modalBody}>
              This will permanently delete all your data including trips, bookings, saved
              places and AI itineraries. This action cannot be undone.
            </p>
            <input
              style={styles.modalInput}
              placeholder="Type DELETE to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
            <div style={styles.modalButtonRow}>
              <button
                style={styles.modalCancelButton}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.modalDeleteButton,
                  opacity: deleteConfirmText === "DELETE" ? 1 : 0.5,
                  cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed",
                }}
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
              >
                Yes delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
