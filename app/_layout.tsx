import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
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
import { DataProvider } from "@context/DataContext";
import "../i18n";
import "../global.css";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import notifee from "@notifee/react-native";
export { ErrorBoundary } from "expo-router";
import * as Notifications from "expo-notifications";

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

	const deviceColorScheme = useColorScheme();
	const [theme, setTheme] = useState(
		deviceColorScheme === "dark" ? DarkTheme : DefaultTheme
	);

	// Récupération du thème sauvegardé
	useEffect(() => {
		(async () => {
			const savedTheme = await AsyncStorage.getItem("theme");
			if (savedTheme) {
				setTheme(savedTheme === "dark" ? DarkTheme : DefaultTheme);
			}
		})();
	}, []);

	// Stabilisation de toggleTheme
	const toggleTheme = useCallback(() => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === DefaultTheme ? DarkTheme : DefaultTheme;
			AsyncStorage.setItem("theme", newTheme === DarkTheme ? "dark" : "light");
			return newTheme;
		});
	}, []);

	// Mémorisation de la valeur du contexte
	const themeContextValue = useMemo(
		() => ({ theme, toggleTheme }),
		[theme, toggleTheme]
	);

	// Enregistrer le service de notifications une seule fois
	useEffect(() => {
		notifee.registerForegroundService((notification) => {
			return new Promise(() => {});
		});
	}, []);

	useEffect(() => {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
		});
	}, []);

	return (
		<ThemeContext.Provider value={themeContextValue}>
			<ThemeProvider value={theme}>
				<StatusBar
					style={theme.dark ? "light" : "dark"}
					backgroundColor={"transparent"}
				/>
				<Stack
					screenOptions={{
						headerShadowVisible: false,
					}}
				>
					<Stack.Screen
						name="(navbar)"
						options={{ headerShown: false, title: "" }}
					/>
					<Stack.Screen name="(select)" options={{ headerShown: false }} />
					<Stack.Screen name="habitDetail" options={{ headerShown: false }} />
					<Stack.Screen
						name="account"
						options={{
							headerShown: false,
							title: "Compte",
						}}
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
						options={{ title: "Réinitialiser le mot de passe" }}
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
						name="pack"
						options={{ title: "Pack", headerShown: false }}
					/>
					<Stack.Screen
						name="dailyRewards"
						options={{ title: "Récompenses journalières", headerShown: false }}
					/>
					<Stack.Screen
						name="workSession"
						options={{ title: "Session de travail", headerShown: false }}
					/>
					<Stack.Screen name="articles" options={{ title: "Articles" }} />
					<Stack.Screen name="articleDetail" options={{ title: "Article" }} />
					<Stack.Screen
						name="manageNotifications"
						options={{ title: "Gestion des notifications", headerShown: false }}
					/>
					<Stack.Screen name="inbox" options={{ title: "Boite de réception" }} />
					<Stack.Screen
						name="cosmeticShop"
						options={{
							title: "Boutique cosmétique",
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
	const { t } = useTranslation();

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

	if (isLoading) return <LoaderScreen text={t("loading")} />;

	return (
		<DataProvider>
			<HabitsProvider>
				<MainNavigator />
			</HabitsProvider>
		</DataProvider>
	);
}

export default function RootLayout() {
	return (
		<SessionProvider>
			<RootLayoutContent />
		</SessionProvider>
	);
}
