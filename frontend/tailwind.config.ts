import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary Purple - #500088
        primary: {
          DEFAULT: "#500088",
          50: "#f7f0ff",
          100: "#f0e0ff",
          200: "#e1c2ff",
          300: "#d1a3ff",
          400: "#b87fff",
          500: "#8000cc",
          600: "#500088",
          700: "#400068",
          800: "#300050",
          900: "#200038",
        },
        // Secondary Dark Purple - #2E1065
        secondary: {
          DEFAULT: "#2e1065",
          light: "#6b4c8f",
          dark: "#1a0536",
          50: "#f5f0ff",
          100: "#ebe0ff",
          200: "#d7c1ff",
          300: "#c3a3ff",
          400: "#af84ff",
          500: "#2e1065",
          600: "#2a0c5a",
          700: "#1f084F",
          800: "#150436",
          900: "#0b021d",
        },
        // Tertiary Brown/Gold - #6D4100
        tertiary: {
          DEFAULT: "#6d4100",
          light: "#b45309",
          dark: "#451a03",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#6d4100",
          900: "#451a03",
        },
        // Neutral Gray - #7C757F
        neutral: {
          DEFAULT: "#7c757f",
          light: "#e5e7eb",
          dark: "#4b5563",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#7c757f",
          900: "#111827",
        },
        // Additional accent colors for the design system
        accent: {
          red: "#dc2626",
          green: "#10b981",
          blue: "#3b82f6",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scroll-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scroll-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "scroll-up": "scroll-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scroll-left": "scroll-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
