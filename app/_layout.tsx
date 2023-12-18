import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Button, useColorScheme } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
// 	// Ensure that reloading on `/modal` keeps a back button present.
// 	initialRouteName: "(navbar)",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const [theme, setTheme] = useState(
		colorScheme === "dark" ? DarkTheme : DefaultTheme
	);

	const toggleTheme = () => {
		setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<ThemeProvider value={theme}>
				<Stack>
					<Stack.Screen name="(navbar)" options={{ headerShown: false }} />
					{/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
					{/* <Stack.Screen name="login" options={{ presentation: "modal" }} /> */}
					{/* <Stack.Screen name="register" options={{ presentation: "modal" }} /> */}
				</Stack>
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}
