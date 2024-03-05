import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import { isUserConnected } from "../db/users";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

// const Stack = createStackNavigator();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [theme, setTheme] = useState(
		useColorScheme() === "dark" ? DarkTheme : DefaultTheme
	);

	const toggleTheme = () => {
		setTheme((prevTheme) =>
			prevTheme === DefaultTheme ? DarkTheme : DefaultTheme
		);
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
					{isAuthenticated ? (
						<Stack>
							<Stack.Screen name="(navbar)" options={{ headerShown: false }} />
							<Stack.Screen
								name="select"
								options={{
									title: "Choix des habitudes",
								}}
							/>
						</Stack>
					) : (
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen
								name="register"
								// component={Register}
								options={{
									headerShown: false,
								}}
							/>
						</Stack>
					)}
				</ThemeProvider>
			</ThemeContext.Provider>
		</>
	);
}
