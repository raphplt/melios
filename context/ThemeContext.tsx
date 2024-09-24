import { createContext, useContext } from "react";
import { DefaultTheme } from "../constants/Theme";

export const ThemeContext = createContext({
	theme: DefaultTheme,
	toggleTheme: () => {},
});

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
