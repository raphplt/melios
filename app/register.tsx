// Register.tsx
import React, { useRef, useState } from "react";
import {
	View,
	ScrollView,
	StatusBar,
	ImageBackground,
	Dimensions,
	Text,
	Pressable,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import CustomTextInput from "@components/Shared/CustomTextInput";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import { createUser, checkEmailExists } from "@db/users";
import { Iconify } from "react-native-iconify";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Member } from "@type/member";
import { useNavigation } from "expo-router";
import { useData } from "@context/DataContext";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import { isUsernameAlreadyUsed } from "@db/member";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ModalTermsOfUse from "@components/Modals/ModalTermsOfUse";

export default function Register() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const [nom, setNom] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verifyPassword, setVerifyPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const { setMember } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();
	const scrollViewRef = useRef<ScrollView>(null);

	// Désactive le bouton si un champ est vide
	const isDisabled =
		nom === "" || email === "" || password === "" || verifyPassword === "";

	const register = async () => {
		// Réinitialise l'erreur précédente
		setError("");

		// Vérification de la présence de tous les champs
		if (!nom || !email || !password || !verifyPassword || !acceptedTerms) {
			setError("Tous les champs sont obligatoires.");
			return;
		}

		// Vérification du format de l'email
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(email)) {
			setError("Le format de l'email est invalide.");
			return;
		}

		// Vérification de la correspondance des mots de passe
		if (password !== verifyPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		// (Optionnel) Vérification d'une longueur minimale pour le mot de passe
		if (password.length < 6) {
			setError("Le mot de passe doit contenir au moins 6 caractères.");
			return;
		}

		// Vérification côté serveur : email déjà utilisé ?
		try {
			const emailExists = await checkEmailExists(email);
			if (emailExists) {
				setError("Cet email est déjà utilisé.");
				return;
			}
		} catch (err) {
			console.error("Erreur lors de la vérification de l'email", err);
		}

		// Vérification côté serveur : nom d'utilisateur déjà utilisé ?
		try {
			const usernameUsed = await isUsernameAlreadyUsed(nom);
			if (usernameUsed) {
				setError("Ce nom d'utilisateur est déjà utilisé.");
				return;
			}
		} catch (err) {
			console.error("Erreur lors de la vérification du nom d'utilisateur", err);
		}

		setIsLoading(true);
		try {
			// La fonction createUser se charge aussi d'envoyer l'email de vérification
			const { user, member } = await createUser(nom, email, password);
			setIsLoading(false);
			if (user) {
				setMember(member as Member);
				navigation.navigate("(select)");
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(error.message || "Erreur lors de la création de l'utilisateur.");
		}
	};

	return (
		<ScrollView
			ref={scrollViewRef}
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps="handled"
		>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="light-content"
			/>

			<ImageBackground
				source={require("@assets/images/onboarding/register.png")}
				style={{
					width: Dimensions.get("window").width,
					height: 300,
				}}
				className="flex flex-col justify-center items-start p-5"
			>
				<Text
					style={{ color: "white", fontSize: 32, fontWeight: "bold" }}
					className="mb-2"
				>
					{t("register")}
				</Text>
				<Text style={{ color: "#f1f1f1" }} className="w-10/12">
					{t("sign_up_to_your_account_description")}
				</Text>
			</ImageBackground>

			<View className="flex flex-col items-center w-full py-3 rounded-xl">
				<View className="flex flex-col justify-center items-start w-11/12">
					<CustomTextInput
						label={t("pseudo")}
						placeholder="Dyonisos"
						value={nom}
						onChangeText={setNom}
						keyboardType="default"
						autoCapitalize="none"
						autoCorrect={false}
						returnKeyType="next"
					/>
					<CustomTextInput
						label={t("email")}
						placeholder="melios@gmail.com"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						returnKeyType="next"
					/>
					<CustomPasswordInput
						onChangeText={setPassword}
						label={t("password")}
						placeholder="********"
						value={password}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						secureTextEntry={!showPassword}
						onSubmitEditing={register}
						returnKeyType="done"
					/>
					<CustomPasswordInput
						onChangeText={setVerifyPassword}
						label={t("repeat_password")}
						placeholder="********"
						value={verifyPassword}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						secureTextEntry={!showPassword}
						onSubmitEditing={register}
						returnKeyType="done"
					/>
				</View>

				<View className="flex flex-row items-center justify-between  w-[95%] relative mt-5 ">
					<TouchableOpacity onPress={() => setOpenModal(true)}>
						<Text
							className="text-sm"
							style={{
								color: theme.colors.primary,
							}}
						>
							{t("accept_terms")}
						</Text>
					</TouchableOpacity>
					<View>
						<BouncyCheckbox
							size={20}
							fillColor={theme.colors.primary}
							useBuiltInState={false}
							isChecked={acceptedTerms}
							onPress={() => setAcceptedTerms(!acceptedTerms)}
						/>
					</View>
				</View>

				<Pressable
					disabled={isDisabled || isLoading}
					style={{
						backgroundColor: isDisabled
							? theme.colors.grayPrimary
							: theme.colors.primary,
					}}
					onPress={register}
					className="w-11/12 mx-auto py-4 rounded-xl mt-4 flex items-center"
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#F8F9FF" />
					) : (
						<Text
							style={{ color: "#F8F9FF" }}
							className="text-[18px] text-center font-semibold"
						>
							{t("i_register")}
						</Text>
					)}
				</Pressable>

				{error !== "" && (
					<View
						className="mx-auto rounded-2xl my-3 p-4 flex flex-row items-center w-11/12"
						style={{ borderColor: theme.colors.redPrimary, borderWidth: 1 }}
					>
						<Iconify
							icon="material-symbols:error"
							color={theme.colors.redPrimary}
							size={20}
						/>
						<Text style={{ color: theme.colors.redPrimary }} className="ml-2">
							{error}
						</Text>
					</View>
				)}

				<ButtonNavigate
					text={t("already_account")}
					text2={t("login")}
					onPress={() => navigation.navigate("login")}
				/>
			</View>

			{openModal && (
				<ModalTermsOfUse
					visible={openModal}
					setVisible={setOpenModal}
					onAccept={() => {
						setAcceptedTerms(true);
						setOpenModal(false);
					}}
				/>
			)}
		</ScrollView>
	);
}
