import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import { isUserConnected } from "../db/users";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./register";
import Index from "./(navbar)";

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

const Stack = createStackNavigator();

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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [theme, setTheme] = useState(
		colorScheme === "dark" ? DarkTheme : DefaultTheme
	);

	const toggleTheme = () => {
		setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
	};

	useEffect(() => {
		(async () => {
			const user = await isUserConnected();
			if (user) {
				setIsAuthenticated(true);
			}
		})();
	}, []);

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme
						? DarkTheme.colors.background
						: DefaultTheme.colors.background
				}
			/>

			<ThemeContext.Provider value={{ theme, toggleTheme }}>
				<ThemeProvider value={theme}>
					<Stack.Navigator>
						{isAuthenticated ? (
							<Stack.Screen
								name="(navbar)"
								component={Index}
								options={{ headerShown: false }}
							/>
						) : (
							<Stack.Screen
								name="register"
								component={Register}
								options={{
									headerShown: false,
								}}
							/>
						)}
					</Stack.Navigator>
				</ThemeProvider>
			</ThemeContext.Provider>
		</>
	);
}