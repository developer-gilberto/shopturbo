/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                main_background: "var(--main_background)",
                foreground: "var(--foreground)",
                primary_color: "var(--primary_color)",
                secondary_color: "var(--secondary_color)",
            },
        },
    },
    plugins: [],
};
