/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0f1115",
          850: "#141824",
          800: "#1a1f2e",
          700: "#232a3d",
          600: "#2d364b",
        },
        electric: {
          400: "#4b7bff",
          500: "#3a63ff",
          600: "#2b4dff",
        },
        indigoGlow: {
          400: "#7a6bff",
          500: "#6a56ff",
          600: "#5a43ff",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(58, 99, 255, 0.2), 0 0 24px rgba(58, 99, 255, 0.25)",
      },
    },
  },
  plugins: [],
}
