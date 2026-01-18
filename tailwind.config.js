/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. Tell Tailwind where your components are located
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // Add your source directory if different
    ],
    theme: {
        extend: {
            // If you are using 'brown' or 'grey' as actual colors, define them here
            colors: {
                grey: "var(--color-grey)", // Example for custom colors
                brown: "var(--color-brown)",
            },
        },
    },

    // 2. 💡 ADD THE SAFELIST HERE 💡
    // This forces Tailwind to generate all class permutations needed for dynamic usage.
    safelist: [
        // --- SHADE 100 (Backgrounds) ---
        "bg-red-100",
        "bg-green-100",
        "bg-yellow-100",
        "bg-pink-100",
        "bg-blue-100",
        "bg-amber-100",
        "bg-zinc-100",

        // --- SHADE 300 (Borders and Tag Backgrounds) ---
        "border-red-300",
        "bg-red-300",
        "border-green-300",
        "bg-green-300",
        "border-yellow-300",
        "bg-yellow-300",
        "border-pink-300",
        "bg-pink-300",
        "border-blue-300",
        "bg-blue-300",
        "border-amber-300",
        "bg-amber-300",
        "border-zinc-300",
        "bg-zinc-300",

        //500
        "border-red-500",
        "bg-red-500",
        "border-green-500",
        "bg-green-500",
        "border-yellow-500",
        "bg-yellow-500",
        "border-pink-500",
        "bg-pink-500",
        "border-blue-500",
        "bg-blue-500",
        "border-amber-500",
        "bg-amber-500",
        "border-zinc-500",
        "bg-zinc-500",

        // --- SHADE 700 (New for Modal Text and Borders) ---
        "border-red-700",
        "text-red-700",
        "placeholder:text-red-700/70",
        "border-green-700",
        "text-green-700",
        "placeholder:text-green-700/70",
        "border-yellow-700",
        "text-yellow-700",
        "placeholder:text-yellow-700/70",
        "border-pink-700",
        "text-pink-700",
        "placeholder:text-pink-700/70",
        "border-blue-700",
        "text-blue-700",
        "placeholder:text-blue-700/70",
        "border-amber-700",
        "text-amber-700",
        "placeholder:text-amber-700/70",
        "border-zinc-700",
        "text-zinc-700",
        "placeholder:text-zinc-700/70",

        // --- Static Classes (from NoteCard) ---
        "text-red-500",
        "text-zinc-400",
        "hover:text-red-500",
    ],

    plugins: [require("@tailwindcss/typography")],
};
