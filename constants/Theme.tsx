import { Theme } from "../types/themes";

const DefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: "rgb(8, 32, 159)",
		background: "#ffffff",
		card: "#ffffff",
		text: "rgb(28, 28, 30)",
		textSecondary: "#F8F9FF",
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 59, 48)",
		backgroundSecondary: "rgb(230, 230, 230)",
		backgroundTertiary: "rgb(128, 183, 255)",
		cardBackground: "#F6F6F6",
		greenPrimary: "#41976C", // Légèrement plus sombre
		greenSecondary: "#D3ECE0", // Légèrement plus clair
		yellowPrimary: "#D1A916", // Légèrement plus sombre
		yellowSecondary: "#FEF9E7", // Légèrement plus clair
		redPrimary: "#B84E4A", // Légèrement plus sombre
		redSecondary: "#F5DADA", // Légèrement plus clair
		bluePrimary: "#448BAD", // Légèrement plus sombre
		blueSecondary: "#D9EEF6", // Légèrement plus clair
		purplePrimary: "#955CD3", // Légèrement plus sombre
		purpleSecondary: "#EADFF2", // Légèrement plus clair
	},
};

const DarkTheme: Theme = {
	dark: true,
	colors: {
		primary: "rgb(10, 132, 255)",
		background: "#222222",
		card: "#222222",
		text: "rgb(229, 229, 231)",
		textSecondary: "rgb(39, 39, 41)",
		border: "rgb(39, 39, 41)",
		notification: "rgb(255, 69, 58)",
		backgroundSecondary: "#424447",
		backgroundTertiary: "rgb(128, 183, 255)",
		cardBackground: "#424447",
		greenPrimary: "#47A86C",
		greenSecondary: "#BEE9CE",
		yellowPrimary: "#DBBB16",
		yellowSecondary: "#FDF3C5",
		redPrimary: "#C95355",
		redSecondary: "#E9BEBF",
		bluePrimary: "#499DBD",
		blueSecondary: "#C9E4F5",
		purplePrimary: "#A16AE8",
		purpleSecondary: "#D3BEE9",
	},
};

export { DefaultTheme, DarkTheme };
