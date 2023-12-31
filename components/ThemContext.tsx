import React from "react";
import { DefaultTheme } from "../constants/Theme";

export const ThemeContext = React.createContext({
	theme: DefaultTheme,
	toggleTheme: () => {},
});
