import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataProvider, useData } from "../context/DataContext";
import LoaderScreen from "@components/Shared/LoaderScreen";
import NotificationBox from "@components/Shared/NotificationBox";
import { HabitsProvider } from "@context/HabitsContext";
import { DarkTheme, DefaultTheme } from "../constants/Theme";
import { SessionProvider, useSession } from "@context/UserContext";
import { ThemeContext } from "@context/ThemeContext";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function MainNavigator() {
	const [loaded, error] = useFonts({
		Baskerville: require("../assets/fonts/LibreBaskerville-Regular.ttf"),
		BaskervilleBold: require("../assets/fonts/LibreBaskerville-Bold.ttf"),
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
	const { popup } = useData();
	const { isOpen } = popup;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isSessionLoading) {
			setIsLoading(false);
		}
	}, [isSessionLoading]);

	if (isLoading || !loaded) return <LoaderScreen text="Chargement..." />;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<ThemeProvider value={theme}>
				<StatusBar
					barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
					backgroundColor={
						theme === DarkTheme ? theme.colors.background : theme.colors.background
					}
				/>
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
							headerShadowVisible: false,
							title: "Détail de l'habitude",
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="account"
						options={{
							headerShadowVisible: false,
							title: "Mon compte",
						}}
					/>

					<Stack.Screen
						name="editProfil"
						options={{
							headerShadowVisible: false,
							title: "Éditer le profil",
						}}
					/>

					<Stack.Screen
						name="trophies"
						options={{
							headerShadowVisible: false,
							title: "Trophées",
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
				{isOpen && <NotificationBox />}
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
			<DataProvider>
				<HabitsProvider>
					<MainNavigator />
				</HabitsProvider>
			</DataProvider>
		</SessionProvider>
	);
}
