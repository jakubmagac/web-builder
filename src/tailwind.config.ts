import type { Config } from "tailwindcss";
import { mtConfig } from "@material-tailwind/react";

const config: Config = {
  content: ['./src/**/*.{html,js}', './node_modules/@material-tailwind/html/**/*.{js,jsx,ts,tsx}'],
  plugins: [mtConfig],

};

export default config;
