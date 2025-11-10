// tailwind.config.mjs
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}", "./public/**/*.html"],
    theme: {
        extend: {
            screens: {
                xs: "400px",
            },
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                "brand-blue": "#1264c1",
                "bright-blue": "#0a7cff",
            },
        },
    },
    plugins: [],
};
