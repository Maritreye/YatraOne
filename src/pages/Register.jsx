import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: "", color: "#E2E8F0" };
    if (password.length < 6) return { level: 1, label: "Weak", color: "#EF4444" };
    if (password.length < 10) return { level: 2, label: "Medium", color: "#F59E0B" };
    return { level: 3, label: "Strong", color: "#10B981" };
  };

  const strength = getPasswordStrength(formData.password);

  const getBarColor = (barIndex) => {
    if (barIndex < strength.level) return strength.color;
    return "#E2E8F0";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email";
    if (formData.phone.length !== 10 || isNaN(formData.phone))
      newErrors.phone = "Enter a valid 10 digit number";
    if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreed) newErrors.agreed = "Please accept the terms";
    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFirebaseError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: formData.fullName });

      await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          name: formData.fullName,
          email: firebaseUser.email,
          phone: formData.phone,
        }),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setFirebaseError("This email is already registered. Please log in.");
      } else {
        setFirebaseError("Registration failed. Please try again.");
      }
    }
  };

  const styles = {
    page: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
    },
    leftPanel: {
      width: "60%",
      background: "#2563EB",
      display: "flex",
      flexDirection: "column",
      padding: "40px",
    },
    logo: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "24px",
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: "-0.5px",
    },
    illustrationBox: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
    },
    illustrationPlaceholder: {
      width: "220px",
      height: "220px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    illustrationIcon: {
      fontSize: "80px",
    },
    tagline: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "18px",
      fontWeight: "500",
      textAlign: "center",
      margin: "0",
    },
    rightPanel: {
      width: "40%",
      background: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      padding: "48px 40px",
    },
    heading: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "28px",
      fontWeight: "700",
      color: "#1E293B",
      margin: "0 0 6px 0",
    },
    subtext: {
      fontSize: "15px",
      color: "#64748B",
      margin: "0 0 28px 0",
    },
    googleBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      border: "1.5px solid #E2E8F0",
      background: "#FFFFFF",
      borderRadius: "8px",
      padding: "13px",
      width: "100%",
      fontSize: "15px",
      fontWeight: "500",
      color: "#1E293B",
      cursor: "pointer",
      marginBottom: "22px",
      boxSizing: "border-box",
    },
    dividerRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "22px",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#E2E8F0",
    },
    dividerText: {
      fontSize: "13px",
      color: "#64748B",
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginBottom: "18px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "500",
      color: "#1E293B",
      marginBottom: "6px",
      display: "block",
    },
    input: (hasError) => ({
      width: "100%",
      height: "48px",
      border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
      borderRadius: "8px",
      padding: "0 14px",
      fontSize: "14px",
      color: "#1E293B",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "'Inter', sans-serif",
    }),
    passwordWrapper: () => ({
      position: "relative",
      width: "100%",
    }),
    passwordInput: (hasError) => ({
      width: "100%",
      height: "48px",
      border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
      borderRadius: "8px",
      padding: "0 44px 0 14px",
      fontSize: "14px",
      color: "#1E293B",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "'Inter', sans-serif",
    }),
    eyeBtn: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0",
      color: "#64748B",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
    },
    errorText: {
      fontSize: "12px",
      color: "#EF4444",
      marginTop: "4px",
      marginBottom: "0",
    },
    strengthBars: {
      display: "flex",
      gap: "4px",
      marginTop: "8px",
    },
    strengthBar: (color) => ({
      flex: 1,
      height: "4px",
      background: color,
      borderRadius: "2px",
    }),
    strengthLabel: (color) => ({
      fontSize: "12px",
      color: color,
      marginTop: "4px",
      marginBottom: "0",
    }),
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    checkbox: (checked) => ({
      width: "20px",
      height: "20px",
      border: `1.5px solid ${checked ? "#2563EB" : "#E2E8F0"}`,
      borderRadius: "4px",
      background: checked ? "#2563EB" : "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
    }),
    checkboxLabel: {
      fontSize: "13px",
      color: "#64748B",
    },
    termsLink: {
      color: "#2563EB",
      fontWeight: "500",
      cursor: "pointer",
    },
    signUpBtn: {
      width: "100%",
      height: "48px",
      background: "#2563EB",
      border: "none",
      borderRadius: "8px",
      color: "#FFFFFF",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "20px",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      padding: "0 24px",
      minHeight: "48px",
      display: "block",
    },
    bottomText: {
      fontSize: "14px",
      color: "#64748B",
      textAlign: "center",
      margin: "0",
    },
    loginLink: {
      color: "#2563EB",
      fontWeight: "500",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.logo}>YatraOne</div>
        <div style={styles.illustrationBox}>
          <div style={styles.illustrationPlaceholder}>
            <span style={styles.illustrationIcon}>🗺️</span>
          </div>
          <p style={styles.tagline}>Join millions of happy travellers</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>Start planning your journey today</p>

        {/* Google Button */}
        <button style={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" />
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" />
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18L4.5 10.52Z" />
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={styles.dividerRow}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Fields */}
        <div style={styles.fieldGroup}>

          {/* Full Name */}
          <div>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              style={styles.input(!!errors.fullName)}
            />
            {errors.fullName && <p style={styles.errorText}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={styles.input(!!errors.email)}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              style={styles.input(!!errors.phone)}
            />
            {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper()}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={styles.passwordInput(!!errors.password)}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.password && (
              <>
                <div style={styles.strengthBars}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={styles.strengthBar(getBarColor(i))}></div>
                  ))}
                </div>
                <p style={styles.strengthLabel(strength.color)}>{strength.label}</p>
              </>
            )}
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrapper()}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                style={styles.passwordInput(!!errors.confirmPassword)}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>

        </div>

        {/* Checkbox */}
        <div style={styles.checkboxRow}>
          <div style={styles.checkbox(agreed)} onClick={() => setAgreed(!agreed)}>
            {agreed && (
              <span style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "bold", lineHeight: "1" }}>✓</span>
            )}
          </div>
          <span style={styles.checkboxLabel}>
            I agree to{" "}
            <span style={styles.termsLink}>Terms & Privacy Policy</span>
          </span>
        </div>
        {errors.agreed && (
          <p style={{ ...styles.errorText, marginTop: "-14px", marginBottom: "12px" }}>
            {errors.agreed}
          </p>
        )}

        {/* Firebase Error */}
        {firebaseError && (
          <div style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {firebaseError}
          </div>
        )}

        {/* Sign Up Button */}
        <button style={styles.signUpBtn} onClick={handleSubmit}>
          Create account
        </button>

        {/* Bottom Link */}
        <p style={styles.bottomText}>
          Already have an account?{" "}
          <span style={styles.loginLink} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}