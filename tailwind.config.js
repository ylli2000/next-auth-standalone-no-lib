/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Use class-based dark mode for next-themes
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {}
    },
    plugins: []
};
