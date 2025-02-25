import type { Config } from "tailwindcss";


const config = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				// regular: ["AtkinsonRegular"],
				// bold: ["AtkinsonBold"],
				// italic: ["AtkinsonItalic"],
			},
			colors: {
				primary: "#0b45c2",
				primaryLight: "#0345c3",
				primaryDark: "#02287a",
				background: "#F3F2F9",
				secondary: "#F68324",
				secondaryLight: "#FA8A26",
				secondaryDark: "#ED6617",
				dark: "#303030",
				gray: "#666666",
			},
		},
	},
} satisfies Config;

export default config;
