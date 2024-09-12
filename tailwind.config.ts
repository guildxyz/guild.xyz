import type { Config } from "tailwindcss"
import colors from 'tailwindcss/colors';

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const em = (px: number, base: number) => `${round(px / base)}em`;

const hexToRgb = (hex: string) => {
  let _hex = hex.replace('#', '');
  _hex = _hex.length === 3 ? _hex.replace(/./g, '$&$&') : _hex;
  const r = Number.parseInt(_hex.substring(0, 2), 16);
  const g = Number.parseInt(_hex.substring(2, 4), 16);
  const b = Number.parseInt(_hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
};

const config = {
  darkMode: ["selector", "[data-theme='dark']"],
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
      fontFamily: {
        sans: ["var(--font-inter,sans-serif)"],
        display: ["var(--font-dystopian,sans-serif)"],
      },
      colors: {
        banner: {
          DEFAULT: "hsl(var(--banner))",
          dark: "hsl(var(--banner-dark))",
          foreground: "hsl(var(--banner-foreground))"
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          muted: "hsl(var(--border-muted))"
        },
        input: {
          background: "hsla(var(--input-background))",
          border: {
            DEFAULT: "hsla(var(--input-border))",
            accent: "hsla(var(--input-border-accent))",
            invalid: "hsl(var(--input-border-invalid))"
          },
        },
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        skeleton: "hsl(var(--skeleton))",
        "anchor-foreground": "hsl(var(--anchor-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          foreground: "hsl(var(--primary-foreground))",
          subtle: "hsl(var(--primary-subtle))",
          "subtle-foreground": "hsl(var(--primary-subtle-foreground))",
        },
        secondary: {
          DEFAULT: "hsla(var(--secondary))",
          hover: "hsla(var(--secondary-hover))",
          active: "hsla(var(--secondary-active))",
          foreground: "hsl(var(--secondary-foreground))",
          subtle: "hsl(var(--secondary-subtle))",
          "subtle-foreground": "hsl(var(--secondary-subtle-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          hover: "hsl(var(--info-hover))",
          active: "hsl(var(--info-active))",
          foreground: "hsl(var(--info-foreground))",
          subtle: "hsl(var(--info-subtle))",
          "subtle-foreground": "hsl(var(--info-subtle-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          hover: "hsl(var(--destructive-hover))",
          active: "hsl(var(--destructive-active))",
          foreground: "hsl(var(--destructive-foreground))",
          subtle: "hsl(var(--destructive-subtle))",
          "subtle-foreground": "hsl(var(--destructive-subtle-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          hover: "hsl(var(--success-hover))",
          active: "hsl(var(--success-active))",
          foreground: "hsl(var(--success-foreground))",
          subtle: "hsl(var(--success-subtle))",
          "subtle-foreground": "hsl(var(--success-subtle-foreground))",
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
        tooltip: {
          DEFAULT: "hsl(var(--tooltip))",
          foreground: "hsl(var(--tooltip-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          secondary: "hsl(var(--card-secondary))",
          foreground: "hsl(var(--card-foreground))",
        },
        image: "hsl(var(--image))",
        alert: {
          success: {
            DEFAULT: "hsla(var(--alert-success))",
            icon: "hsl(var(--alert-success-icon))",
          },
          info: {
            DEFAULT: "hsla(var(--alert-info))",
            icon: "hsl(var(--alert-info-icon))",
          },
          warning: {
            DEFAULT: "hsla(var(--alert-warning))",
            icon: "hsl(var(--alert-warning-icon))",
          },
          error: {
            DEFAULT: "hsla(var(--alert-error))",
            icon: "hsl(var(--alert-error-icon))",
          },
        },
        // Platforms
        discord: {
          DEFAULT: "hsl(var(--discord))",
          hover: "hsl(var(--discord-hover))",
          active: "hsl(var(--discord-active))",
        },
        telegram: {
          DEFAULT: "hsl(var(--telegram))",
          hover: "hsl(var(--telegram-hover))",
          active: "hsl(var(--telegram-active))",
        },
        email: {
          DEFAULT: "hsl(var(--email))",
          hover: "hsl(var(--email-hover))",
          active: "hsl(var(--email-active))",
        },
        google: {
          DEFAULT: "hsl(var(--google))",
          hover: "hsl(var(--google-hover))",
          active: "hsl(var(--google-active))",
        },
        twitter: {
          DEFAULT: "hsl(var(--twitter))",
          hover: "hsl(var(--twitter-hover))",
          active: "hsl(var(--twitter-active))",
        },
        github: {
          DEFAULT: "hsl(var(--github))",
          hover: "hsl(var(--github-hover))",
          active: "hsl(var(--github-active))",
        },
        polygonid: {
          DEFAULT: "hsl(var(--polygonid))",
          hover: "hsl(var(--polygonid-hover))",
          active: "hsl(var(--polygonid-active))",
        },
        farcaster: {
          DEFAULT: "hsl(var(--farcaster))",
          hover: "hsl(var(--farcaster-hover))",
          active: "hsl(var(--farcaster-active))",
        },
      },
      opacity: {
        banner: "var(--banner-opacity)"
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "collapse-open": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
        },
        "collapse-closed": {
          from: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "collapse-open": "collapse-open 200ms ease-out",
        "collapse-closed": "collapse-closed 200ms ease-out",
      },
      zIndex: {
        // Using these from Chakra UI until we use both design systems at the same time
        overlay: "1300",
        modal: "1400",
        popover: "1500",
        toast: "1700",
        tooltip: "1800",
      },
    },
    typography: () => ({
      DEFAULT: {
        css: {
          a: {
            fontWeight: 'inherit',
            color: 'hsl(var(--anchor-foreground))',
          },
          'a:hover': {
            textDecoration: 'underline',
          },
          blockquote: {
            fontWeight: 'inherit',
            fontStyle: 'italic',
            color: 'var(--tw-prose-quotes)',
            borderLeftWidth: '0.25rem',
            borderLeftColor: 'var(--tw-prose-quote-borders)',
            quotes: '"\\201C""\\201D""\\2018""\\2019"',
          },
          'blockquote p:first-of-type::before': {
            content: '',
          },
          'blockquote p:last-of-type::after': {
            content: '',
          },
          'code::before': {
            content: '',
          },
          'code::after': {
            content: '',
          },
          img: {
            borderRadius: 'var(--radius)',
          },
          p: {
            textWrap: 'pretty',
          },
          ':not(pre) > code': {
            color: 'hsl(var(--card-foreground))',
            borderRadius: 'var(--radius)',
            padding: "2px 5px",
            fontSize: em(20, 20),
            backgroundColor: 'hsl(var(--background))',
          },
        },
      },
      xl: {
        css: [
          {
            'pre code': {
              fontSize: em(18, 20),
            },
            figcaption: {
              fontSize: em(15, 20),
            },
            code: {
              fontSize: em(15, 20),
            },
          },
        ],
      },
      custom: {
        css: {
          '--tw-prose-body': colors.neutral[700],
          '--tw-prose-headings': colors.neutral[900],
          '--tw-prose-lead': colors.neutral[600],
          '--tw-prose-links': `hsl(var(--anchor-foreground))`,
          '--tw-prose-bold': colors.neutral[900],
          '--tw-prose-counters': colors.neutral[500],
          '--tw-prose-bullets': colors.neutral[300],
          '--tw-prose-hr': colors.neutral[200],
          '--tw-prose-quotes': colors.neutral[900],
          '--tw-prose-quote-borders': colors.neutral[200],
          '--tw-prose-captions': colors.neutral[500],
          '--tw-prose-kbd': colors.neutral[900],
          '--tw-prose-kbd-shadows': hexToRgb(colors.neutral[900]),
          '--tw-prose-code': colors.neutral[900],
          '--tw-prose-pre-code': colors.neutral[200],
          '--tw-prose-pre-bg': colors.neutral[800],
          '--tw-prose-th-borders': colors.neutral[300],
          '--tw-prose-td-borders': colors.neutral[200],
          '--tw-prose-invert-body': colors.neutral[300],
          '--tw-prose-invert-headings': colors.white,
          '--tw-prose-invert-lead': colors.neutral[400],
          '--tw-prose-invert-links': `hsl(var(--anchor-foreground))`,
          '--tw-prose-invert-bold': colors.white,
          '--tw-prose-invert-counters': colors.neutral[400],
          '--tw-prose-invert-bullets': colors.neutral[600],
          '--tw-prose-invert-hr': colors.neutral[700],
          '--tw-prose-invert-quotes': colors.neutral[100],
          '--tw-prose-invert-quote-borders': colors.neutral[700],
          '--tw-prose-invert-captions': colors.neutral[400],
          '--tw-prose-invert-kbd': colors.white,
          '--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
          '--tw-prose-invert-code': colors.white,
          '--tw-prose-invert-pre-code': colors.neutral[300],
          '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
          '--tw-prose-invert-th-borders': colors.neutral[600],
          '--tw-prose-invert-td-borders': colors.neutral[700],
        },
      },
    }),
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
} satisfies Config

export default config
