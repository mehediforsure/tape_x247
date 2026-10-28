import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        oxide: "rgb(var(--c-bg) / <alpha-value>)",
        shell: "rgb(var(--c-shell) / <alpha-value>)",
        rule: "rgb(var(--c-rule) / <alpha-value>)",
        paper: "rgb(var(--c-text) / <alpha-value>)",
        dim: "rgb(var(--c-muted) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        label: "rgb(var(--c-label) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-ui)", "var(--font-bn-sans)", "var(--font-body)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-ui)", "var(--font-bn-sans)", "var(--font-display)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        editorial: ["var(--font-editorial)", "var(--font-bn-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        stamp: ["var(--font-stamp)", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
