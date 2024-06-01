import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import { isUserConnected } from "../db/users";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

	useEffect(() => {
		(async () => {
			const savedTheme = await AsyncStorage.getItem("theme");
			setTheme(savedTheme === "dark" ? DarkTheme : DefaultTheme);
		})();
	}, []);

	const toggleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === DefaultTheme ? DarkTheme : DefaultTheme;
			AsyncStorage.setItem("theme", newTheme === DarkTheme ? "dark" : "light");
			return newTheme;
		});
	};

	useEffect(() => {
		(async () => {
			const user = await isUserConnected();
			if (user) {
				setIsAuthenticated(true);
				await AsyncStorage.setItem("isAuthenticated", "true");
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const savedAuthState = await AsyncStorage.getItem("isAuthenticated");
			setIsAuthenticated(savedAuthState === "true");
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
									animation: "fade",
								}}
							/>
							<Stack.Screen
								name="habitDetail"
								options={{
									title: "Détail de l'habitude",
									presentation: "transparentModal",
									headerShown: false,
								}}
							/>
						</Stack>
					) : (
						<Stack>
							<Stack.Screen name="(navbar)" options={{ headerShown: false }} />

							<Stack.Screen
								name="register"
								options={{
									title: "Inscription",
								}}
							/>
							<Stack.Screen
								name="login"
								options={{
									title: "Connexion",
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
