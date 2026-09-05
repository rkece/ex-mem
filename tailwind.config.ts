import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0D0D0F",
        surface: "#17171A",
        "surface-raised": "#1E1E22",
        "border-hairline": "#2A2A2E",
        "text-primary": "#EDEAE2",
        "text-secondary": "#8C887E",
        gold: "#C6A667",
        sage: "#7E9788",
        rust: "#B06B4A",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xs: "2px",
        sm: "3px",
        DEFAULT: "4px",
      },
      borderWidth: {
        hairline: "0.5px",
      },
    },
  },
  plugins: [],
};

export default config;
