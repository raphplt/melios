import React, { useContext, useEffect, useState, useRef } from "react";
import {
	View,
	Pressable,
	Text,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	ImageBackground,
	StatusBar,
} from "react-native";

import {
	useNavigation,
	ParamListBase,
	NavigationProp,
} from "@react-navigation/native";
import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import ButtonNavigate from "@components/Shared/ButtonNavigate";
import { BlurView } from "expo-blur";
import { ThemeContext } from "@context/ThemeContext";
import { useSession } from "@context/UserContext";
import { loginUser } from "@db/users";

export default function Login() {
	const { theme } = useContext(ThemeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);

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

	const isDisabled = email === "" || password === "";

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
		>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="light-content"
			/>
			<ScrollView
				ref={scrollViewRef}
				style={{ backgroundColor: theme.colors.background }}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flexGrow: 1,
				}}
			>
				<ImageBackground
					source={require("../assets/images/illustrations/login-bg.jpg")}
					resizeMode="cover"
					style={{
						flex: 1,
						justifyContent: "center",
					}}
				>
					<BlurView
						intensity={70}
						className="w-11/12 mx-auto p-5 rounded-xl"
						style={{
							overflow: "hidden",
						}}
					>
						<View className="flex flex-col items-center w-full py-3 rounded-xl">
							<Image
								source={require("../assets/images/icon.png")}
								style={{ width: 100, height: 100 }}
								className="mb-5"
							/>
							<View className="flex flex-col justify-center items-center w-full">
								<Text style={{ color: "rgb(28, 28, 30)" }} className="text-3xl ">
									Bienvenue sur
								</Text>
								<Text
									style={{ color: "rgb(28, 28, 30)" }}
									className="text-3xl font-bold"
								>
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
									onFocus={() => {
										scrollViewRef.current?.scrollToEnd({ animated: true });
									}}
								/>

								<CustomPasswordInput
									onChangeText={setPassword}
									label="Votre mot de passe"
									placeholder="********"
									value={password}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
									secureTextEntry={!showPassword}
									onFocus={() => {
										scrollViewRef.current?.scrollToEnd({ animated: true });
									}}
								/>
							</View>

							<Pressable
								onPress={login}
								disabled={isDisabled}
								style={{
									backgroundColor: isDisabled
										? theme.colors.grayPrimary
										: theme.colors.primary,
								}}
								className="w-11/12 mx-auto py-3 rounded-3xl focus:bg-blue-800 mt-10 mb-5 flex items-center"
							>
								<Text
									style={{ color: "#F8F9FF" }}
									className="text-[18px] text-center font-semibold"
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
							<ButtonNavigate
								text="Je n'ai pas de compte"
								onPress={() => navigation.navigate("register")}
							/>
						</View>
					</BlurView>
				</ImageBackground>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
