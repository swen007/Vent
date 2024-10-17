/** @type {import('tailwindcss').Config} */

const withOpacity =
    (varName) =>
    ({ opacityValue }) => {
        return `rgba(var(--${varName}), ${opacityValue})`;
    };

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    important: "body",
    theme: {
        extend: {
            colors: {
                primary: `var(--primary)`,
                secondary: `var(--secondary)`,
                bgColor: withOpacity("bgColor"),
                textColor: withOpacity("textColor"),
                info: `var(--info)`,
                warning: `var(--warning)`,
                error: `var(--error)`,
                success: `var(--success)`,
            },
        },
    },
    plugins: [],
};
