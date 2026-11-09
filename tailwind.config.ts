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
          dark: "#09090d",
          card: "#12121a",
        },
      },
      boxShadow: {
        neon: "0 0 25px rgba(255, 30, 66, 0.45)",
        "neon-sm": "0 0 12px rgba(255, 30, 66, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
