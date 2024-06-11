import React, { useContext, useEffect, useState } from "react";
import {
	View,
	TextInput,
	Pressable,
	Text,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { loginUser } from "../db/users";
import { ThemeContext } from "../components/ThemeContext";
import { useNavigation } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSession } from "../constants/UserContext";
export default function Login() {
	const { theme } = useContext(ThemeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigation: any = useNavigation();
	const { user, isLoading } = useSession();

	useEffect(() => {
		return navigation.addListener("beforeRemove", (e: any) => {
			if (!user) {
				// Prevent default behavior of leaving the screen
				e.preventDefault();
			}
		});
	}, [navigation, user]);

	useEffect(() => {
		if (!isLoading && user) {
			navigation.navigate("(navbar)");
		}
	}, [isLoading, user, navigation]);
	const login = async () => {
		try {
			const snapshot: any = await loginUser(email, password);

			if (snapshot.error) {
				setError(snapshot.error);
				return;
			} else {
				console.log("Utilisateur connecté avec succès.");
			}
		} catch (error) {
			setError("Erreur lors de la connexion.");
			console.error("Erreur lors de la création de l'utilisateur : ", error);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={{ backgroundColor: theme.colors.background }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-col h-[90vh] justify-start mt-24 items-center w-full">
					<Image
						source={require("../assets/images/icon.png")}
						style={{ width: 100, height: 100 }}
						className="mb-10 mt-12"
					/>
					<Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
						Connexion à Melios
					</Text>
					<View className="flex flex-col justify-center items-center w-full mt-10 mx-auto">
						<TextInput
							onChangeText={setEmail}
							value={email}
							placeholder="Email"
							keyboardType="email-address"
							autoCapitalize="none"
							autoComplete="email"
							style={{ color: theme.colors.text }}
							placeholderTextColor={"#333333"}
							className="text-lg w-10/12 mx-auto pl-2 py-5 pb-1 border-b-2 "
						/>
						<View className="flex flex-row w-10/12 mx-auto items-start justify-between border-b-2 mt-10 py-1">
							<TextInput
								onChangeText={setPassword}
								value={password}
								placeholder="Mot de passe"
								secureTextEntry={!showPassword}
								style={{ color: theme.colors.text }}
								placeholderTextColor={"#333333"}
								className="text-lg pl-2"
							/>
							<Pressable onPress={() => setShowPassword(!showPassword)} style={{}}>
								<FontAwesome5
									name={showPassword ? "eye-slash" : "eye"}
									size={20}
									color={theme.colors.text}
								/>
							</Pressable>
						</View>
					</View>
					<Text className="text-center text-lg mt-6 text-red-500 mb-12">
						{error}
					</Text>
					<Pressable
						onPress={login}
						disabled={email === "" || password === ""}
						style={{
							backgroundColor: theme.colors.primary,
							opacity: email === "" || password === "" ? 0.5 : 1,
						}}
						className="w-10/12 mx-auto py-2 rounded-3xl focus:bg-blue-800 mb-4 flex items-center"
					>
						<Text
							style={{ color: theme.colors.textSecondary }}
							className="text-xl text-center"
						>
							Se connecter
						</Text>
					</Pressable>
					<Pressable
						onPress={() => navigation.navigate("register")}
						style={{
							borderColor: theme.colors.primary,
							backgroundColor: theme.colors.cardBackground,
						}}
						className="p-2 rounded-xl mt-8 w-1/3 mx-auto border-[1px] border-gray-300"
					>
						<Text
							className="text-center text-md font-semibold"
							style={{ color: theme.colors.primary }}
						>
							Ou S'inscrire
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
