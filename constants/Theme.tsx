import { Theme } from "../types/themes";

const DefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: "rgb(0, 122, 255)",
		background: "rgb(242, 242, 242)",
		card: "rgb(255, 255, 255)",
		text: "rgb(28, 28, 30)",
		textSecondary: "rgb(209, 209, 214)",
		border: "rgb(216, 216, 216)",
		notification: "rgb(255, 59, 48)",
		activeSwitch: "rgb(0, 122, 255)",
		inactiveSwitch: "rgb(230, 230, 230)",
		activeThumb: "rgb(255, 255, 255)",
		inactiveThumb: "rgb(0, 122, 255)",
		backgroundSecondary: "#D9D9D9",
	},
};

const DarkTheme: Theme = {
	dark: true,
	colors: {
		primary: "rgb(10, 132, 255)",
		background: "#1c1c1b",
		card: "rgb(18, 18, 18)",
		text: "rgb(229, 229, 231)",
		textSecondary: "rgb(209, 209, 214)",
		border: "rgb(39, 39, 41)",
		notification: "rgb(255, 69, 58)",
		activeSwitch: "rgb(10, 132, 255)",
		inactiveSwitch: "rgb(58, 58, 60)",
		activeThumb: "rgb(255, 255, 255)",
		inactiveThumb: "rgb(10, 132, 255)",
		backgroundSecondary: "#424447",
	},
};

export { DefaultTheme, DarkTheme };
