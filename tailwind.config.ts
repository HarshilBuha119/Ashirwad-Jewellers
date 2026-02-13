import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // Ashirwad Jewellers Design System
        luxury: {
          dark: "#0F172A",      // Deep luxury black-blue
          gold: "#C9A24D",      // Gold accent
          light: "#ebebeb",     // Light background
        },
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "#C9A24D",
        background: "#ebebeb",
        foreground: "#0F172A",
        primary: {
          DEFAULT: "#0F172A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C9A24D",
          foreground: "#0F172A",
        },
        accent: {
          DEFAULT: "#C9A24D",
          foreground: "#0F172A",
        },
        muted: {
          DEFAULT: "#94A3B8",
          foreground: "#0F172A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
