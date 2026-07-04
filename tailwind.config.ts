import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#07070a",
        panel: "#11111a",
        muted: "#a0a0ad",
        brand: "#e50914",
        gold: "#f7c948",
        electric: "#6d5dfc"
      },
      boxShadow: {
        glow: "0 0 60px rgba(229, 9, 20, 0.22)",
        card: "0 20px 70px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        spotlight: "radial-gradient(circle at top left, rgba(229,9,20,.28), transparent 32%), radial-gradient(circle at 75% 10%, rgba(109,93,252,.22), transparent 28%)"
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
        22: "0.22",
        28: "0.28",
        35: "0.35",
        45: "0.45",
        48: "0.48",
        55: "0.55",
        58: "0.58",
        62: "0.62",
        65: "0.65",
        68: "0.68",
        78: "0.78"
      }
    }
  },
  plugins: []
};

export default config;
