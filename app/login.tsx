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
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSession } from "../context/UserContext";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
} from "@react-navigation/native";
import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";

export default function Login() {
	const { theme } = useContext(ThemeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { user, isLoading } = useSession();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		return navigation.addListener("beforeRemove", (e: any) => {
			if (!user) {
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
				navigation.navigate("index");
				console.log("Utilisateur connecté avec succès.");
			}
		} catch (error) {
			setError("Erreur lors de la connexion.");
			console.log("Erreur lors de la création de l'utilisateur : ", error);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
			className="h-fit"
		>
			<ScrollView
				style={{ backgroundColor: theme.colors.background }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-col mt-24 items-center w-full">
					<Image
						source={require("../assets/images/icon.png")}
						style={{ width: 100, height: 100 }}
						className="mb-5 mt-12"
					/>
					<View className="flex flex-col justify-center items-center w-full">
						<Text style={{ color: theme.colors.text }} className="text-3xl ">
							Bienvenue sur
						</Text>
						<Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
							Melios
						</Text>
					</View>
					<View className="flex flex-col justify-center items-center w-full mt-5">
						<CustomTextInput
							label="Votre email"
							placeholder="melios@gmail.com"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							error=""
						/>

						<CustomPasswordInput
							onChangeText={setPassword}
							label="Votre mot de passe"
							placeholder="********"
							value={password}
							error=""
							showPassword={showPassword}
							setShowPassword={setShowPassword}
							secureTextEntry={!showPassword}
						/>
					</View>

					<Pressable
						onPress={login}
						disabled={email === "" || password === ""}
						style={{
							backgroundColor: theme.colors.primary,
							opacity: email === "" || password === "" ? 0.5 : 1,
						}}
						className="w-11/12 mx-auto py-3 rounded-3xl focus:bg-blue-800 mt-10 mb-5 flex items-center"
					>
						<Text
							style={{ color: theme.colors.textSecondary }}
							className="text-[18px] text-center"
						>
							Se connecter
						</Text>
					</Pressable>

					<View
						className=" mx-auto rounded-2xl"
						style={{
							backgroundColor: theme.colors.redSecondary,
							opacity: error === "" ? 0 : 1,
							padding: 10,
						}}
					>
						<Text
							style={{
								color: theme.colors.redPrimary,
							}}
						>
							{error}
						</Text>
					</View>

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