
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand Colors
        primary: { DEFAULT: "#7c9a92" },
        secondary: { DEFAULT: "#253334" },
        tertiary: "#7c9a92",
        alternate: "#262d34",
        // Utility Colors
        "primary-text": "#ffffff",
        "secondary-text": "#b3ffffff",
        "primary-bg": "#253334",
        "secondary-bg": "#e6ffffff",
        // Accent Colors
        accent1: "#4c4b39ef",
        accent2: "#4d39d2c0",
        accent3: "#4dee8b60",
        accent4: "#b2262d34",
        // Semantic Colors
        success: "#249689",
        error: "#ff5963",
        warning: "#f9cf58",
        info: "#ffffff",
        // Custom Colors
        custom1: "#acacac",
        custom2: "#bec2c2",
        // Card and shutdown existing defaults
        card: { DEFAULT: "#253334", foreground: "#ffffff" },
        muted: { DEFAULT: "#253334", foreground: "#b3ffffff" },
        popover: { DEFAULT: "#262d34", foreground: "#ffffff" },
        background: "#253334",
        foreground: "#ffffff",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Fade/slide/scale per system context
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
