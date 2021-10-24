module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    textColor: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      default: "var(--color-text-default)",
      inverse: "var(--color-text-inverse)"
    },
    backgroundColor: {
      inverse: "var(--color-bg-inverse)",
      primary: "var(--color-bg-primary)",
      accent: "var(--color-bg-accent)",
      default: "var(--color-bg-default)"
    },
    fontWeights: {
      normal: "var(--font-weight-normal)",
      thick: "var(--font-weight-thick)",
    },
    borderColor: {
      primary: "var(--color-text-primary)",
      accent: "var(--color-bg-accent)",
    },
    borderRadius: {
      none: "0",
      full: "9999px",
      normal: "var(--radius-normal)"
    },
    extend: {
    },
  },
  variants: {
    extend: {
      
    },
  },
  plugins: [],
}
