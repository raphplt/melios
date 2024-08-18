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
		greenPrimary: "#41976C",
		greenSecondary: "#D3ECE0",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FEF9E7",
		redPrimary: "#B84E4A",
		redSecondary: "#F5DADA",
		bluePrimary: "#448BAD",
		blueSecondary: "#D9EEF6",
		purplePrimary: "#955CD3",
		purpleSecondary: "#EADFF2",
		grayPrimary: "#B0B0B0",
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
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 69, 58)",
		backgroundSecondary: "#424447",
		backgroundTertiary: "rgb(128, 183, 255)",
		cardBackground: "#424447",
		greenPrimary: "#41976C",
		greenSecondary: "#D3ECE0",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FEF9E7",
		redPrimary: "#B84E4A",
		redSecondary: "#F5DADA",
		bluePrimary: "#448BAD",
		blueSecondary: "#D9EEF6",
		purplePrimary: "#955CD3",
		purpleSecondary: "#EADFF2",
		grayPrimary: "#B0B0B0",
	},
};

export { DefaultTheme, DarkTheme };
