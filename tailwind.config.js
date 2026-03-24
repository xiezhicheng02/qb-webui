/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Theme variables are now defined using the @theme directive in src/assets/tailwind.css
      // This allows us to use CSS custom properties as Tailwind classes
    },
  },
  corePlugins: {
    // Disable preflight to avoid conflicts with Element Plus styles
    preflight: false,
  },
  plugins: [],
}