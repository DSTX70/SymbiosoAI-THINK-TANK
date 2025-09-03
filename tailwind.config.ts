import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // SymbiosoAi brand colors - Updated with exact palette
        brand: {
          midnight: "rgb(var(--brand-midnight))",
          blue: "rgb(var(--brand-blue))",
          teal: "rgb(var(--brand-teal))",
          slate: "rgb(var(--brand-slate))",
          silver: "rgb(var(--brand-silver))",
          warm: "rgb(var(--brand-warm))",
          accent: {
            50: "rgb(var(--brand-accent-50))",
            100: "rgb(var(--brand-accent-100))",
            200: "rgb(var(--brand-accent-200))",
            300: "rgb(var(--brand-accent-300))",
            400: "rgb(var(--brand-accent-400))",
            500: "rgb(var(--brand-accent-500))",
            600: "rgb(var(--brand-accent-600))",
            700: "rgb(var(--brand-accent-700))",
            800: "rgb(var(--brand-accent-800))",
            900: "rgb(var(--brand-accent-900))",
          }
        },
        // Surface tokens
        surface: {
          bg: "var(--surface-bg)",
          panel: "var(--surface-panel)",
          elevated: "var(--surface-elevated)",
        },
        // Text tokens  
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        // Status tokens
        status: {
          info: "var(--status-info)",
          success: "var(--status-success)", 
          warn: "var(--status-warn)",
          error: "var(--status-error)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"], 
        mono: ["var(--font-mono)"],
        // Legacy compatibility
        sans: ["var(--font-body)"],
        serif: ["var(--font-serif)"],
      },
      fontSize: {
        'display': ['var(--text-display)', { lineHeight: 'var(--lh-display)' }],
        'h1': ['var(--text-h1)', { lineHeight: 'var(--lh-h1)' }],
        'h2': ['var(--text-h2)', { lineHeight: 'var(--lh-h2)' }],
        'h3': ['var(--text-h3)', { lineHeight: 'var(--lh-h3)' }],
        'lead': ['var(--text-lead)', { lineHeight: 'var(--lh-lead)' }],
        'body': ['var(--text-body)', { lineHeight: 'var(--lh-body)' }],
        'caption': ['var(--text-caption)', { lineHeight: 'var(--lh-caption)' }],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
