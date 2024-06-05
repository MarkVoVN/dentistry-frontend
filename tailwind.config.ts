/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      // center: true,
      screens: {
        "2xl": "1204px",
      },
    },
    fontFamily: {
      "be-vietnam-pro": ["Be Vietnam Pro", "sans-serif"],
      orbitron: ["Orbitron", "sans-serif"],
    },
    colors: {
      primary: {
        // DEFAULT: "#005669",
        // 900: "#00718A",
        // 800: "#0098ba",
        // 700: "#00bae3",
        // 600: "#0cd3ff",
        // 500: "#35daff",
        // 400: "#5de2ff",
        // 300: "#85e9ff",
        // 200: "#aef0ff",
        // 100: "#d7f8ff",
        // 50: "#ebfbff",

        DEFAULT: "#0516cd",
        900: "#525edc",
        800: "#7780e4",
        700: "#929ae9",
        600: "#a9aeee",
        500: "#bcc0f2",
        400: "#cdd1f5",
        300: "#dddff8",
        200: "#f9f9fe",
        100: "#ebedfb",
        50: "#dddff8",
      },
      secondary: {
        // DEFAULT: "#6CB2BC",
        // 900: "#7bbac3",
        // 800: "#89c1c9",
        // 700: "#98c9d0",
        // 600: "#a7d1d7",
        // 500: "#b6d9de",
        // 400: "#c4e0e4",
        // 300: "#d3e8eb",
        // 200: "#e2f0f2",
        // 100: "#f0f7f8",
        // 50: "#f8fbfc",

        DEFAULT: "#004170",
        900: "#006fbe",
        800: "#2d8fd5",
        700: "#5aa7de",
        600: "#7dbae5",
        500: "#9bcaeb",
        400: "#b5d8f0",
        300: "#cce4f5",
        200: "#e2eff9",
        100: "#f6fafd",
      },
      error: {
        1: "#FEF8F6",
        2: "#ff003c",
      },
      accent: {
        1: "#d2202f",
        2: "#df5f6a",
        3: "#e6838b",
        4: "#FF8878",
      },
      discount: "#19b43c",
      link: "#0984e3",
    },
    extend: {
      boxShadow: {
        "search-bar": "0px 2px 4px 0px #00000026",
      },
      backgroundImage: {
        "gradient-132": "linear-gradient(132deg, var(--tw-gradient-stops))",
      },
      colors: {
        shade: {
          "1-100%": "#FFFFFF",
          "1-85%": "rgba(255, 255, 255, 0.85)",
          "1-75%": "rgba(255, 255, 255, 0.75)",
          "2-100%": "#222222",
          "2-30%": "rgba(34, 34, 34, 0.3)",
          "2-5%": "rgba(34, 34, 34, 0.05)",
        },
        neutral: {
          1: "#F7F7F7",
          2: "#F2F2F2",
          3: "#DDDDDD",
          4: "#D3D3D3",
          5: "#C2C2C2",
          6: "#B0B0B0",
          7: "#636e72",
          8: "#2d3436",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // secondary: {
        //   DEFAULT: "hsl(var(--secondary))",
        //   foreground: "hsl(var(--secondary-foreground))",
        // },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
