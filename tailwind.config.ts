import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // primary: "#111827", // gray.900
        // secondary: "#4B5563", // gray.600
        // accent: "#D1D5DB", // gray.300
        // background: "#ffffff", // white
        // foreground: "#000000", // black
        // muted: "#F3F4F6", // gray.100
        // border: "#E5E7EB", // gray.200
        // input: "#F9FAFB", // gray.50
        // danger: "#DC2626", // red.600
        // success: "#22c55e", // green 500

        dark: {
          // primary: "#ffffff",
          // secondary: "#DC2626",
          // background: "#0f172a", // slate.900
          // foreground: "#f8fafc", // slate.50
        },
      },
    },
  },
  plugins: [],
};
export default config;
