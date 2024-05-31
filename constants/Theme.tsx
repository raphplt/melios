import { Theme } from "../types/themes";

const DefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: "rgb(0, 122, 255)",
		background: "#ffffff",
		card: "#ffffff",
		text: "rgb(28, 28, 30)",
		textSecondary: "#F8F9FF",
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 59, 48)",
		activeSwitch: "rgb(0, 122, 255)",
		inactiveSwitch: "rgb(230, 230, 230)",
		activeThumb: "rgb(255, 255, 255)",
		inactiveThumb: "rgb(0, 122, 255)",
		backgroundSecondary: "rgb(230, 230, 230)",
		backgroundTertiary: "rgb(128, 183, 255)",
		cardBackground: "#F6F6F6",
		coins: "#FFD31A",
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
		activeSwitch: "rgb(10, 132, 255)",
		inactiveSwitch: "rgb(58, 58, 60)",
		activeThumb: "rgb(255, 255, 255)",
		inactiveThumb: "rgb(10, 132, 255)",
		backgroundSecondary: "#424447",
		backgroundTertiary: "rgb(128, 183, 255)",
		cardBackground: "#424447",
		coins: "#FFD31A",
	},
};

export { DefaultTheme, DarkTheme };