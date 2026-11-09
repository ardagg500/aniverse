import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: "#ff1e42",
          crimson: "#e50914",
          dark: "#050508",
          card: "#0d0d16",
        },
      },
      boxShadow: {
        neon: "0 0 25px rgba(255, 30, 66, 0.45)",
        "neon-sm": "0 0 12px rgba(255, 30, 66, 0.35)",
        "neon-lg": "0 0 40px rgba(255, 30, 66, 0.6)",
        "purple-neon": "0 0 30px rgba(168, 85, 247, 0.35)",
      },
      animation: {
        "spin-very-slow": "spin 40s linear infinite",
        "pulse-slow": "pulse 6s ease-in-out infinite",
        "pulse-slower": "pulse 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
