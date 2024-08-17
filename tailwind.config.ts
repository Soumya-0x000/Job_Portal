import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
// import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                Lxl: "1400px",
                Lmd: "960px",
                Lmd1: "970px",
                xsm: "420px",
                lsm: "530px",
                BtstrpLg: "992px",
                Llg: "1100px",
                Cxl: "1230px",
                "3xl": "1600px",
            },
            fontFamily: {
                montserrat: ["Montserrat", "sans-serif"],
                lato: ["Lato", "sans-serif"],
                onest: ["Onest", "sans-serif"],
                robotoMono: ["Roboto Mono", "monospace"],
                mooli: ["Mooli", "sans-serif"],
                mavenPro: ["Maven Pro", "sans-serif"],
                oxanium: ["Oxanium", "cursive"],
                mPlusp: ["M PLUS 1p"],
                jaldi: ["Jaldi", "sans-serif"],
                k2d: ["K2D", "sans-serif"],
                body: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "system-ui",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "Noto Sans",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
                sans: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "system-ui",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "Noto Sans",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
            },
            animation: {
                "text-reveal":
                    "text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
            },
            keyframes: {
                "text-reveal": {
                    "0%": {
                        transform: "translate(0, 100%)",
                    },
                    "100%": {
                        transform: "translate(0, 0)",
                    },
                },
            },
            colors: {
                primary: {
                    "50": "#eff6ff",
                    "100": "#dbeafe",
                    "200": "#bfdbfe",
                    "300": "#93c5fd",
                    "400": "#60a5fa",
                    "500": "#3b82f6",
                    "600": "#2563eb",
                    "700": "#1d4ed8",
                    "800": "#1e40af",
                    "900": "#1e3a8a",
                    "950": "#172554",
                },
            },
            boxShadow: {
                input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
            },
        },
    },
    plugins: [addVariablesForColors],
};

function addVariablesForColors({
    addBase,
    theme,
}: {
    addBase: (styles: Record<string, Record<string, string>>) => void;
    theme: (path: string) => Record<string, string>;
}) {
    const allColors = flattenColorPalette(theme("colors"));

    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    ) as Record<string, string>;

    addBase({
        ":root": newVars,
    });
}
