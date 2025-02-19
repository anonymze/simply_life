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
				// primary: "#35a099",
			},
		},
	},
} satisfies Config;

export default config;
