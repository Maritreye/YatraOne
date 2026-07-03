import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEAM = [
  { name: "Aditi Sharma", role: "Founder & Product Lead", emoji: "👩‍💼" },
  { name: "Rahul Verma", role: "Engineering Lead", emoji: "👨‍💻" },
  { name: "Sneha Iyer", role: "Design Lead", emoji: "👩‍🎨" },
];

const VALUES = [
  { icon: "🧭", title: "Effortless Planning", desc: "One platform for trains, hotels, places and itineraries — no more juggling ten different apps." },
  { icon: "🤖", title: "AI-Powered", desc: "Our Gemini-powered planner builds a personalized day-by-day itinerary in seconds, tailored to your budget and interests." },
  { icon: "🇮🇳", title: "Built for India", desc: "Designed around how Indians actually travel — trains, local food, festivals, and budget-conscious trips." },
  { icon: "🔒", title: "Trustworthy", desc: "Transparent redirects to IRCTC, MakeMyTrip and OYO for booking — we never touch your payment details." },
];

const STATS = [
  { value: "500+", label: "Cities Covered" },
  { value: "10,000+", label: "Tourist Places" },
  { value: "50,000+", label: "Itineraries Planned" },
  { value: "4.7★", label: "Average Rating" },
];

const FAQS = [
  {
    q: "Is YatraOne a booking platform?",
    a: "No. YatraOne helps you search and plan, then redirects you to IRCTC for trains and MakeMyTrip/OYO for hotels to complete the actual booking.",
  },
  {
    q: "How does the AI itinerary work?",
    a: "Tell us your destination, dates, budget and interests, and our Gemini-powered planner generates a complete day-by-day itinerary including places, food and travel times.",
  },
  {
    q: "Is YatraOne free to use?",
    a: "Yes, YatraOne is completely free to use. We don't charge any commission since we don't process bookings directly.",
  },
  {
    q: "Which cities does YatraOne support?",
    a: "We're starting with major Indian tourist destinations like Jaipur, Delhi, Goa and Manali, with more cities being added regularly.",
  },
];

function StatCard({ value, label }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "#2563EB" }}>{value}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div
      style={{
        flex: "1 1 calc(50% - 10px)",
        minWidth: "260px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: "#EFF6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "16px", color: "#1E293B" }}>{title}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B", lineHeight: "1.6" }}>{desc}</div>
    </div>
  );
}

function TeamCard({ name, role, emoji }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        {emoji}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#1E293B" }}>{name}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#64748B" }}>{role}</div>
    </div>
  );
}

function FaqItem({ q, a, open, onClick }) {
  return (
    <div style={{ borderBottom: "1px solid #E2E8F0", padding: "18px 0" }}>
      <div
        onClick={onClick}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#1E293B" }}>{q}</div>
        <span style={{ color: "#64748B", fontSize: "18px" }}>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B", marginTop: "10px", lineHeight: "1.6" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

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
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px", color: "#2563EB", cursor: "pointer" }}
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
            { label: "About", path: "/about" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: item.label === "About" ? "#2563EB" : "#475569",
                fontWeight: item.label === "About" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#1E293B",
          padding: "64px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            padding: "6px 16px",
            borderRadius: "20px",
          }}
        >
          About YatraOne
        </div>
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "36px",
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Making travel planning across India simple, smart and stress-free
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          YatraOne brings trains, hotels, tourist places, maps and AI itinerary planning together in one place, so you can spend less time researching and more time exploring.
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          gap: "20px",
          boxSizing: "border-box",
          flexWrap: "wrap",
        }}
      >
        {STATS.map((s) => (
          <StatCard key={s.label} value={s.value} label={s.label} />
        ))}
      </div>

      {/* Our Mission */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 40px 24px", boxSizing: "border-box" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "40px",
            display: "flex",
            gap: "40px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#1E293B" }}>
              Our Mission
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#64748B", marginTop: "12px", lineHeight: "1.7" }}>
              Planning a trip in India usually means hopping between five different apps — one for trains, one for
              hotels, one for maps, one for things to do. YatraOne was built to bring all of that into a single,
              clean experience, topped off with an AI planner that does the heavy lifting for you.
            </div>
          </div>
          <div
            style={{
              flex: "1 1 260px",
              height: "200px",
              backgroundColor: "#D1D5DB",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop"
              alt="Travel planning"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* Why YatraOne */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 40px 24px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#1E293B", marginBottom: "20px" }}>
          Why YatraOne
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {VALUES.map((v) => (
            <ValueCard key={v.title} {...v} />
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 40px 24px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#1E293B", marginBottom: "20px" }}>
          The Team
        </div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {TEAM.map((t) => (
            <TeamCard key={t.name} {...t} />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px 40px 24px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#1E293B", marginBottom: "10px" }}>
          Frequently Asked Questions
        </div>
        <div>
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px 60px 24px", boxSizing: "border-box" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "22px", color: "#1E293B" }}>
            Get in touch
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#64748B", marginTop: "4px", marginBottom: "24px" }}>
            Have feedback, a partnership idea, or just want to say hi? Drop us a message.
          </div>

          {submitted && (
            <div
              style={{
                backgroundColor: "#ECFDF5",
                color: "#065F46",
                border: "1px solid #A7F3D0",
                borderRadius: "8px",
                padding: "12px 16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Thanks for reaching out! We'll get back to you soon.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                  Your name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    height: "44px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "0 14px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    height: "44px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "0 14px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1E293B" }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                style={{
                  height: "120px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              onClick={handleSubmit}
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                padding: "14px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Send Message
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#1E293B",
          padding: "32px 80px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}>
          YatraOne
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
          © 2026 YatraOne. Built as a college project. Not affiliated with IRCTC, MakeMyTrip or OYO.
        </div>
      </div>
    </div>
  );
}
