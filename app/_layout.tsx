import React, { useEffect, useState } from "react";
import { StatusBar, Text, View, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionProvider } from "../constants/UserContext";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

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
	const [isLoading, setIsLoading] = useState(true);

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
			const savedAuthState = await AsyncStorage.getItem("isAuthenticated");
			setIsAuthenticated(savedAuthState === "true");
			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center h-screen">
				<Text className="text-2xl font-bold text-center text-gray-700">
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<SessionProvider>
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
									presentation: "transparentModal",
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
						<Stack
							screenOptions={{
								headerShown: false,
							}}
						>
							<Stack.Screen
								name="register"
								options={{
									title: "Inscription",
									headerShown: false,
									gestureEnabled: false,
								}}
							/>
							<Stack.Screen
								name="login"
								options={{
									title: "Connexion",
									headerShown: false,
									gestureEnabled: false,
								}}
							/>
						</Stack>
					)}
				</ThemeProvider>
			</ThemeContext.Provider>
		</SessionProvider>
	);
}
