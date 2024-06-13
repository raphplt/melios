import React, { useEffect, useState, useContext } from "react";
import { StatusBar, Text, View, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemeContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionProvider, useSession } from "../constants/UserContext"; // Utiliser useSession

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function MainNavigator() {
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

	const { isLoading: isSessionLoading }: any = useSession();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isSessionLoading) {
			setIsLoading(false);
		}
	}, [isSessionLoading]);

	if (isLoading || !loaded) {
		return (
			<View className="flex-1 items-center justify-center h-screen">
				<Text className="text-2xl font-bold text-center text-gray-700">
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<ThemeProvider value={theme}>
				<Stack>
					<Stack.Screen name="(navbar)" options={{ headerShown: false }} />
					<Stack.Screen
						name="select"
						options={{
							title: "Choix des habitudes",
							animation: "fade",
							presentation: "transparentModal",
							headerShown: true,
							headerShadowVisible: false,
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
					<Stack.Screen
						name="login"
						options={{
							title: "Connexion",
							headerShown: false,
							gestureEnabled: false,
						}}
					/>
					<Stack.Screen
						name="register"
						options={{
							title: "Inscription",
							headerShown: false,
							gestureEnabled: false,
						}}
					/>
				</Stack>
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export default function RootLayout() {
	const { user, isLoading: isSessionLoading }: any = useSession();
	const navigation: any = useNavigation();
	const [isNavigationReady, setIsNavigationReady] = useState(false);

	useEffect(() => {
		return navigation.addListener("ready", () => {
			setIsNavigationReady(true);
		});
	}, [navigation]);

	useEffect(() => {
		if (!isSessionLoading && !user && isNavigationReady) {
			navigation.navigate("login");
		} 
	}, [isSessionLoading, user, isNavigationReady]);

	return (
		<SessionProvider>
			<MainNavigator />
		</SessionProvider>
	);
}
