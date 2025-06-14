export type Theme = {
	dark: boolean;
	colors: {
		primary: string;
		secondary: string;
		tertiary: string;
		primaryLight: string;
		background: string;
		card: string;
		text: string;
		textSecondary: string;
		textTertiary: string;
		border: string;
		notification: string;
		primary: string;
		backgroundSecondary: string;
		backgroundTertiary: string;
		cardBackground: string;
		greenPrimary: string;
		greenSecondary: string;
		yellowPrimary: string;
		yellowSecondary: string;
		redPrimary: string;
		redSecondary: string;
		orangePrimary: string;
		orangeSecondary: string;
		bluePrimary: string;
		blueSecondary: string;
		blueTertiary: string;
		purplePrimary: string;
		purpleSecondary: string;
		grayPrimary: string;
		// Nouvelles couleurs pour l'ambiance mythologie grecque
		mythologyGold?: string;
		mythologyBlue?: string;
		mythologyPurple?: string;
		mythologyGreen?: string;
	};
	fonts: {
		regular: FontStyle;
		medium: FontStyle;
		bold: FontStyle;
		heavy: FontStyle;
	};
};
