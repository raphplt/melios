import { Theme } from "../type/themes";

const DefaultTheme: Theme = {
	dark: false,
	colors: {
		primary: "rgb(8, 32, 159)",
		primaryLight: "rgb(8, 32, 159, 0.5)",
		secondary: "rgb(135, 206, 250)",
		tertiary: "rgb(180, 180, 230)",
		background: "#ffffff",
		card: "#ffffff",
		text: "rgb(28, 28, 30)",
		textSecondary: "#F8F9FF",
		textTertiary: "rgb(78, 78, 80)",
		border: "rgb(213, 213, 221)",
		notification: "rgb(255, 59, 48)",
		backgroundSecondary: "rgb(240, 240, 240)",
		backgroundTertiary: "rgb(200, 200, 255)",
		cardBackground: "#F6F6F6",
		greenPrimary: "#47A86C",
		greenSecondary: "#CDEAD6",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FFF4C2",
		redPrimary: "#C95355",
		redSecondary: "#FFD1CC",
		orangePrimary: "#FFA500",
		orangeSecondary: "#FFE5B3",
		bluePrimary: "#448BAD",
		blueSecondary: "#CDEAF7",
		blueTertiary: "#2a4365",
		purplePrimary: "#955CD3",
		purpleSecondary: "#E5D1F7",
		grayPrimary: "#B0B0B0",
	},
	fonts: {
		regular: {
			fontFamily: "Baskerville",
			fontWeight: "normal",
		},
		medium: {
			fontFamily: "Baskerville",
			fontWeight: "500",
		},
		bold: {
			fontFamily: "BaskervilleBold",
			fontWeight: "bold",
		},
		heavy: {
			fontFamily: "BaskervilleBold",
			fontWeight: "900",
		},
	},
};

const DarkTheme: Theme = {
	dark: true,
	colors: {
		primary: "#7396FF",
		primaryLight: "rgb(10, 132, 255, 0.5)",
		secondary: "#FFD700",
		tertiary: "rgb(180, 180, 230)",
		background: "#222222",
		card: "#222222",
		text: "rgb(229, 229, 231)",
		textSecondary: "rgb(39, 39, 41)",
		textTertiary: "rgb(179, 179, 181)",
		border: "#403F47",
		notification: "rgb(255, 69, 58)",
		backgroundSecondary: "#4A4A4A",
		backgroundTertiary: "rgb(60, 60, 120)",
		cardBackground: "#3A3A3A",
		greenPrimary: "#47A86C",
		greenSecondary: "#E6F5E8",
		yellowPrimary: "#D1A916",
		yellowSecondary: "#FFFBEA",
		redPrimary: "#C95355",
		redSecondary: "#FBEAEA",
		orangePrimary: "#FFA500",
		orangeSecondary: "#FFF5E6",
		bluePrimary: "#448BAD",
		blueSecondary: "#1E3A8A",
		blueTertiary: "#2a4365",
		purplePrimary: "#955CD3",
		purpleSecondary: "#F5EAFB",
		grayPrimary: "#808080",
	},
	fonts: {
		regular: {
			fontFamily: "Baskerville",
			fontWeight: "normal",
		},
		medium: {
			fontFamily: "Baskerville",
			fontWeight: "500",
		},
		bold: {
			fontFamily: "BaskervilleBold",
			fontWeight: "bold",
		},
		heavy: {
			fontFamily: "BaskervilleBold",
			fontWeight: "900",
		},
	},
};

export { DefaultTheme, DarkTheme };
