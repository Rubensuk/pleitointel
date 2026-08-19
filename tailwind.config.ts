import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05060a",
          900: "#0b0d14",
          850: "#10131c",
          800: "#151926",
        },
        accent: {
          500: "#d98e2b",
          600: "#b8721a",
        },
        map: {
          500: "#3b82f6",
          600: "#2563eb",
        },
        signal: {
          green: "#22c55e",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
