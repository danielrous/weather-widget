// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // etc...
  ],
  theme: {
    extend: {
      //
    },
  },
  plugins: [],
};

export default config;