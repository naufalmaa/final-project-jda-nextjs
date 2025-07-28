// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: "#3b82f6",   // sky-blue accent
            DEFAULT: "#1e3a8a", // your main darker blue
            dark: "#1e40af",    // deeper hover/shadow
          },
        },
      },
    },
    plugins: [],
  }
  