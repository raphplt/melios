import { createContext } from "react";
import { DefaultTheme } from "../constants/Theme";

export const ThemeContext = createContext({
	theme: DefaultTheme,
	toggleTheme: () => {},
});
