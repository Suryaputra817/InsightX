/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1e",
        surface: "#111827",
        card: "#1a2236",
        border: "#1e2d45",
        brandRed: "#ef4444",
        brandGreen: "#22c55e",
        brandAmber: "#f59e0b",
        brandBlue: "#3b82f6",
        brandPurple: "#8b5cf6",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
