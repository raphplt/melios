import { Text, View } from "../../components/Themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import ToggleButton from "../../components/Switch";
import { onAuthStateChanged } from "firebase/auth";
import { Pressable, Image, StatusBar } from "react-native";
import {
	DarkTheme,
	ThemeProvider,
	useNavigation,
} from "@react-navigation/native";
import { disconnectUser } from "../../db/users";
import { auth } from "../../db";
import { getMemberInfos } from "../../db/member";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [memberInfos, setMemberInfos] = useState<any>([]);
	const isMounted = useRef(true);
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsSignedIn(!!user);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberInfos();
				setMemberInfos(data);
				setLoading(false);
			} catch (error) {
				handleError(error);
				setMemberInfos([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleToggleTheme = async () => {
		toggleTheme();
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	const handleToggleNotifications = async () => {
		setNotifications(!notifications);
		await AsyncStorage.setItem("notifications", notifications ? "true" : "false");
	};

	const handleLogout = async () => {
		await disconnectUser();
	};

	const navigation: any = useNavigation();

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme
						? theme.colors.backgroundSecondary
						: theme.colors.backgroundSecondary
				}
			/>
			<ThemeProvider value={theme}>
				<ScrollView
					className="h-[100vh]"
					style={{ backgroundColor: theme.colors.background }}
				>
					{isSignedIn ? (
						<View style={{ backgroundColor: theme.colors.background }}>
							<View
								className="mx-auto flex flex-row pt-6 justify-center w-11/12 items-center mb-12"
								style={{ backgroundColor: theme.colors.background }}
							>
								<Image
									source={require("../../assets/images/pfp.jpg")}
									className="rounded-full mx-auto mt-4"
									style={{ width: 120, height: 120 }}
								/>
								<View
									className="mx-auto flex flex-col gap-5 max-w-[50%]"
									style={{ backgroundColor: theme.colors.background }}
								>
									<Text
										className=" ml-6 mb-4 text-xl mt-3"
										style={{ color: theme.colors.text }}
									>
										{memberInfos?.nom}
									</Text>
									<Text
										className=" ml-6 mb-4 text-lg mt-3"
										style={{ color: theme.colors.text }}
									>
										{auth.currentUser?.email}
									</Text>
								</View>
							</View>

							<Pressable
								onPress={handleLogout}
								className="mx-auto bg-red-500 py-1 border-red-500 border-[1px] px-3 rounded-lg w-3/5 flex items-center justify-center flex-row"
							>
								<View className="mx-2 bg-transparent">
									<AntDesign name="logout" size={20} color="white" className="mx-2" />
								</View>
								<Text className="text-lg text-center text- mx-2">Déconnexion</Text>
							</Pressable>
						</View>
					) : (
						<View style={{ backgroundColor: theme.colors.background }}>
							<Text
								className=" ml-6 mb-4 text-xl mt-6  text-center"
								style={{ color: theme.colors.text }}
							>
								Non connecté
							</Text>
							<Pressable
								onPress={() => navigation.navigate("register")}
								className=" bg-blue-500 py-2 px-4 rounded-2xl w-2/3 mx-auto mt-4"
							>
								<Text
									style={{ color: theme.colors.textSecondary }}
									className="text-lg text-center"
								>
									Inscription
								</Text>
							</Pressable>
							<Text
								className="text-xl text-center my-3"
								style={{ color: theme.colors.text }}
							>
								ou
							</Text>
							<Pressable
								onPress={() => navigation.navigate("login")}
								className="mx-auto bg-green-500 py-2 px-4 rounded-2xl w-2/3"
							>
								<Text
									style={{ color: theme.colors.textSecondary }}
									className="text-lg text-center"
								>
									Connexion
								</Text>
							</Pressable>
						</View>
					)}
					<View
						style={{
							height: 1,
							width: "80%",
						}}
						className="mx-auto my-6 mt-12"
					/>
					<Text
						className="w-10/12 mx-auto mb-4 text-lg font-semibold"
						style={{ color: theme.colors.text }}
					>
						Paramètres supplémentaires
					</Text>
					<View />
					<View
						className="w-11/12 mx-auto"
						style={{ backgroundColor: theme.colors.background }}
					>
						<ToggleButton
							title="Mode sombre"
							onToggle={handleToggleTheme}
							value={isDarkTheme}
						/>
						<ToggleButton
							title="Notifications"
							onToggle={handleToggleNotifications}
							value={notifications}
						/>
					</View>
				</ScrollView>
				<View
					className="w-full mx-auto mt-12 absolute bottom-0 pt-1"
					style={{ backgroundColor: theme.colors.backgroundSecondary }}
				>
					<Text
						className=" text-center  text-sm"
						style={{ color: theme.colors.text }}
					>
						Melios v1.0.0 - © 2024 Melios. Tous droits réservés.
					</Text>
				</View>
			</ThemeProvider>
		</>
	);
}
