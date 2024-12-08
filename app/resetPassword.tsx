import CachedImage from "@components/Shared/CachedImage";
import CustomTextInput from "@components/Shared/CustomTextInput";
import { ThemeContext } from "@context/ThemeContext";
import { isValidEmail } from "@utils/dataValidation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useContext, useRef, useState } from "react";
import {
	View,
	Text,
	Image,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";

export default function ResetPassword() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const { theme } = useContext(ThemeContext);
	const auth = getAuth();
	const scrollViewRef = useRef<ScrollView>(null);

	const onSubmit = async () => {
		if (!isValidEmail(email)) {
			setError("Veuillez entrer une adresse email valide.");
			return;
		}

		try {
			await sendPasswordResetEmail(auth, email);
			setSuccess("Un email de réinitialisation a été envoyé.");
			setError("");
		} catch (err) {
			setError("Une erreur s'est produite. Veuillez réessayer.");
			setSuccess("");
		}
	};

	const updateEmail = (text: string) => {
		setEmail(text);
		setError("");
		setSuccess("");
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
		>
			<ScrollView
				ref={scrollViewRef}
				style={{ backgroundColor: theme.colors.background }}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flexGrow: 1,
				}}
			>
				<View
					className="h-screen flex flex-col items-center"
					style={{
						backgroundColor: theme.colors.background,
					}}
				>
					<CachedImage
						imagePath="images/illustrations/character1.png"
						style={{ width: "20%", height: "20%", marginVertical: 16 }}
					/>
					<View className=" w-full">
						<Text
							className="text-lg font-bold text-center  w-11/12"
							style={{ color: theme.colors.text }}
						>
							Vous avez oublié votre mot de passe ?
						</Text>
						<Text
							className="w-10/12 mx-auto mt-3"
							style={{ color: theme.colors.textTertiary }}
						>
							Pas de problème ! Entrez votre adresse email et nous vous enverrons un
							lien pour réinitialiser votre mot de passe.
						</Text>
						<View className="w-11/12 mx-auto rounded-lg p-3 mt-2" style={{}}>
							<CustomTextInput
								label="Email"
								placeholder="Entrez votre adresse email"
								value={email}
								onChangeText={updateEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								onFocus={() => {
									scrollViewRef.current?.scrollToEnd({ animated: true });
								}}
								onSubmitEditing={onSubmit}
							/>
							{error ? <Text style={{ color: "red" }}>{error}</Text> : null}
							{success ? <Text style={{ color: "green" }}>{success}</Text> : null}
							<Pressable
								onPress={onSubmit}
								className="p-3 w-full rounded-lg mt-5"
								style={{
									backgroundColor: theme.colors.primary,
								}}
							>
								<Text
									style={{ color: theme.colors.textSecondary, textAlign: "center" }}
								>
									Envoyer
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
