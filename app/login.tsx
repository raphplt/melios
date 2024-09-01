import React, { useContext, useEffect, useState, useRef } from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	ImageBackground,
	StatusBar,
	Text,
	Image,
	Pressable,
} from "react-native";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import { BlurView } from "expo-blur";

//Custom imports
import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import { ThemeContext } from "@context/ThemeContext";
import { useSession } from "@context/UserContext";
import { loginUser } from "@db/users";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonLogin from "@components/LoginRegister/ButtonLogin";

export default function Login() {
	const { theme } = useContext(ThemeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const passwordInputRef = useRef(null);
	const isFocused = useIsFocused();

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

	useEffect(() => {
		if (!isFocused) {
			setEmail("");
			setPassword("");
			setError("");
		}
	}, [isFocused]);

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
								className="mb-4"
							/>
							<View className="flex flex-col justify-center items-center w-full">
								<Text style={{ color: "rgb(28, 28, 30)" }} className="text-3xl">
									Bon retour sur
								</Text>
								<Text
									style={{ color: "rgb(28, 28, 30)" }}
									className="text-3xl font-bold"
								>
									Melios
								</Text>
							</View>
							<View className="flex flex-col justify-center items-center w-full mt-3">
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
									onSubmitEditing={() =>
										passwordInputRef.current && (passwordInputRef.current as any).focus()
									}
									returnKeyType="next"
								/>
								<View>
									<CustomPasswordInput
										ref={passwordInputRef}
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
										onSubmitEditing={login}
										returnKeyType="done"
									/>
									<Pressable>
										<Text
											style={{
												color: theme.colors.primary,
											}}
											className="mt-1 ml-2"
											onPress={() => navigation.navigate("resetPassword")}
										>
											Mot de passe oublié ?
										</Text>
									</Pressable>
								</View>
							</View>

							<ButtonLogin login={login} isDisabled={isDisabled} theme={theme} />
							<View
								className="mx-auto rounded-2xl my-4 p-3 flex flex-row items-center w-full"
								style={{
									backgroundColor: theme.colors.redSecondary,
									display: error === "" ? "none" : "flex",
								}}
							>
								<Iconify
									icon="material-symbols:error"
									color={theme.colors.redPrimary}
									size={20}
								/>
								<Text
									style={{
										color: theme.colors.redPrimary,
									}}
									className="ml-2"
								>
									{error}
								</Text>
							</View>
						</View>
					</BlurView>
					<ButtonNavigate
						text="Je n'ai pas de compte"
						onPress={() => navigation.navigate("register")}
					/>
				</ImageBackground>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
