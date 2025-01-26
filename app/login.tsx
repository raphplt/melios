import React, { useEffect, useState, useRef } from "react";
import {
	View,
	ScrollView,
	ImageBackground,
	StatusBar,
	Text,
	Image,
	TouchableOpacity,
} from "react-native";
import {
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import { BlurView } from "expo-blur";

//Custom imports
import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import { useSession } from "@context/UserContext";
import { loginUser } from "@db/users";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonLogin from "@components/LoginRegister/ButtonLogin";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HelpModal from "@components/Modals/HelpModal";
import { useTheme } from "@context/ThemeContext";
import { getCachedImage } from "@db/files";
import { useHabits } from "@context/HabitsContext";
import { useTranslation } from "react-i18next";
import {
	GoogleSignin,
	GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import {
	getAuth,
	signInWithCredential,
	GoogleAuthProvider,
} from "firebase/auth";
import { useNavigation } from "expo-router";
import { loginOrCreateGoogleUser } from "@db/googleLogin";

export default function Login() {
	const { theme } = useTheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const passwordInputRef = useRef(null);
	const isFocused = useIsFocused();
	const { t } = useTranslation();

	const { user, isLoading } = useSession();
	const { refreshCategories, refreshHabits } = useHabits();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const [loadingLogin, setLoadingLogin] = useState(false);

	useEffect(() => {
		console.log("Login screen mounted", process.env.EXPO_PUBLIC_WEB_CLIENT_ID);
		GoogleSignin.configure({
			webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
		});
	}, []);

	const signInWithGoogle = async () => {
		try {
			// Vérifiez si les Play Services sont disponibles (Android)
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

			// Demandez à l'utilisateur de se connecter à Google
			await GoogleSignin.signIn();

			// Récupérez les tokens après la connexion
			const { idToken } = await GoogleSignin.getTokens();

			// Créez une credential Firebase avec l'idToken
			const googleCredential = GoogleAuthProvider.credential(idToken);

			// Connexion à Firebase
			const auth = getAuth();
			const userCredential = await signInWithCredential(auth, googleCredential);

			// Redirection ou rafraîchissement
			navigation.navigate("(navbar)");
		} catch (error) {
			console.error("Erreur Google Signin:", error);
			setError("Erreur Google Signin");
		}
	};

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
			setLoadingLogin(true);
			const snapshot: User | { error: string } = await loginUser(email, password);

			if ("error" in snapshot) {
				setError(snapshot.error);
				return;
			} else {
				refreshCategories(true);
				refreshHabits(true);
			}
		} catch (error) {
			setError("Erreur lors d e la connexion.");
		} finally {
			setLoadingLogin(false);
		}
	};

	const isDisabled = email === "" || password === "";

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const checkFirstTime = async () => {
			const firstTime = await AsyncStorage.getItem("firstTime");
			if (!firstTime || firstTime === "true") {
				setShowModal(true);
				await AsyncStorage.setItem("firstTime", "false");
			}
		};

		checkFirstTime();
	}, []);

	const [image, setImage] = useState<string | null>("images/fallback.png");

	useEffect(() => {
		let isMounted = true;
		const fetchImage = async () => {
			try {
				const localUri = await getCachedImage(`images/illustrations/login-bg.jpg`);
				if (isMounted) setImage(localUri);
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		fetchImage();

		return () => {
			isMounted = false;
		};
	}, []);

	if (showModal) {
		return (
			<HelpModal
				visible={showModal}
				setVisible={setShowModal}
				onClose={() => setShowModal(false)}
			/>
		);
	}

	return (
		<ScrollView
			ref={scrollViewRef}
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				flexGrow: 1,
			}}
			keyboardShouldPersistTaps="handled"
		>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="light-content"
			/>
			<ImageBackground
				source={image ? { uri: image } : undefined}
				resizeMode="cover"
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<BlurView
					intensity={70}
					className="w-11/12 mx-auto p-6 rounded-xl py-8"
					style={{
						overflow: "hidden",
					}}
					tint="light"
				>
					<View className="flex flex-col items-center w-full py-3 rounded-xl">
						<Image
							source={require("../assets/images/icon.png")}
							style={{ width: 100, height: 100 }}
							className="mb-4"
						/>
						<View className="flex flex-col justify-center items-center w-full">
							<Text style={{ color: "rgb(28, 28, 30)" }} className="text-3xl">
								{t("welcome_back_to")}
							</Text>
							<Text
								style={{ color: "rgb(28, 28, 30)" }}
								className="text-3xl font-bold"
							>
								Melios
							</Text>
						</View>
						<View className="flex flex-col justify-center items-start w-full mt-3">
							<CustomTextInput
								label="Votre email"
								placeholder="melios@gmail.com"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								// onFocus={() => {
								// 	scrollViewRef.current?.scrollToEnd({ animated: true });
								// }}
								onSubmitEditing={() =>
									passwordInputRef.current && (passwordInputRef.current as any).focus()
								}
								returnKeyType="next"
							/>
							<CustomPasswordInput
								ref={passwordInputRef}
								onChangeText={setPassword}
								label="Votre mot de passe"
								placeholder="********"
								value={password}
								showPassword={showPassword}
								setShowPassword={setShowPassword}
								secureTextEntry={!showPassword}
								// onFocus={() => {
								// 	scrollViewRef.current?.scrollToEnd({ animated: true });
								// }}
								onSubmitEditing={login}
								returnKeyType="done"
							/>
							<TouchableOpacity>
								<Text
									style={{
										color: theme.colors.primary,
									}}
									className="mt-1 ml-2"
									onPress={() => navigation.navigate("resetPassword")}
								>
									{t("forget_password_question")}
								</Text>
							</TouchableOpacity>
						</View>

						<ButtonLogin
							login={login}
							isDisabled={isDisabled}
							isLoading={loadingLogin}
						/>

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

					<GoogleSigninButton
						style={{
							width: 200,
							height: 54,
							alignSelf: "center",
							marginTop: 20,
						}}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={signInWithGoogle}
					/>
				</BlurView>
				<ButtonNavigate
					text={t("no_account")}
					onPress={() => navigation.navigate("register")}
				/>
			</ImageBackground>
		</ScrollView>
	);
}