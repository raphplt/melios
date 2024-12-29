import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { HabitsProvider } from "@context/HabitsContext";
import { SessionProvider, useSession } from "@context/UserContext";
import { ThemeContext } from "@context/ThemeContext";
import { DarkTheme, DefaultTheme } from "@constants/Theme";
import { TimerProvider } from "@context/TimerContext";
import { DataProvider } from "@context/DataContext";
import "../i18n";
import "../global.css";

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

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<ThemeProvider value={theme}>
				<StatusBar
					barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
					backgroundColor={theme.colors.background}
				/>
				<Stack>
					<Stack.Screen
						name="(navbar)"
						options={{ headerShown: false, title: "" }}
					/>
					<Stack.Screen name="(select)" options={{ headerShown: false }} />
					<Stack.Screen name="habitDetail" options={{ headerShown: false }} />
					<Stack.Screen
						name="account"
						options={{ headerShadowVisible: false, title: "Mon compte" }}
					/>
					<Stack.Screen
						name="editProfil"
						options={{ headerShadowVisible: false, title: "Éditer le profil" }}
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
					<Stack.Screen
						name="resetPassword"
						options={{ title: "Réinitialisation du mot de passe" }}
					/>
					<Stack.Screen
						name="editHabits"
						options={{ title: "Éditer mes habitudes", headerShadowVisible: false }}
					/>
					<Stack.Screen
						name="editGoals"
						options={{ title: "Éditer mes objectifs", headerShadowVisible: false }}
					/>
					<Stack.Screen name="timerHabit" options={{ headerShown: false }} />
					<Stack.Screen
						name="classement"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen name="levelDetail" options={{ headerShown: false }} />
					<Stack.Screen
						name="help"
						options={{ title: "Aide", headerShadowVisible: false }}
					/>
					<Stack.Screen
						name="friendList"
						options={{ title: "Liste d'amis", headerShadowVisible: false }}
					/>
					<Stack.Screen
						name="feedbackForm"
						options={{ title: "Liste d'amis", headerShown: false }}
					/>
					<Stack.Screen
						name="cosmeticShop"
						options={{
							title: "Boutique cosmétique",
							headerShadowVisible: false,
							headerBackTitleVisible: false,
							headerTitleStyle: {
								fontFamily: "BaskervilleBold",
								fontSize: 18,
							},
						}}
					/>
				</Stack>
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

function RootLayoutContent() {
	const { user, isLoading: isSessionLoading } = useSession();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const [isNavigationReady, setIsNavigationReady] = useState(false);

	useEffect(() => {
		return navigation.addListener("state", () => {
			setIsNavigationReady(true);
		});
	}, [navigation]);

	useEffect(() => {
		if (!isSessionLoading && !user && isNavigationReady) {
			navigation.navigate("login");
		}
	}, [isSessionLoading, user, isNavigationReady]);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isSessionLoading) {
			setIsLoading(false);
		}
	}, [isSessionLoading]);

	if (isLoading) return <LoaderScreen text="Chargement cc..." />;

	return (
		<TimerProvider>
			<DataProvider>
				<HabitsProvider>
					<MainNavigator />
				</HabitsProvider>
			</DataProvider>
		</TimerProvider>
	);
}

export default function RootLayout() {
	return (
		<SessionProvider>
			<RootLayoutContent />
		</SessionProvider>
	);
}
