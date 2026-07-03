/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        teal: "#0F766E",
        bg: "#F8FAFC",
        dark: "#1E293B",
        muted: "#64748B",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        btn: "8px",
        card: "12px",
        badge: "20px",
      },
    },
  },
  plugins: [],
};