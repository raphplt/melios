import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import CustomTextInput from "@components/Shared/CustomTextInput";
import ButtonNext from "@components/LoginRegister/ButtonNext";
import { Answer } from "../../constants/Slides";
import { isValidEmail } from "@utils/dataValidation";
import { isUsernameAlreadyUsed } from "@db/member";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";

export default function InputText({
	question,
	goToNextQuestion,
	error,
	slug,
}: {
	question: string;
	goToNextQuestion: (answer: Answer) => void;
	error?: string;
	slug: string;
}) {
	const [text, setText] = useState("");
	const [showError, setShowError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { theme } = useTheme();

	const resetText = () => {
		setText("");
		setShowError(false);
		setUsernameError(false);
		setLoading(false);
	};

	useEffect(() => {
		resetText();
	}, [question]);

	const handleTextChange = (inputText: string) => {
		setText(inputText);
		setShowError(false);
	};

	const isValidName = (name: string) => /^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(name);

	const goNext = async () => {
		if (slug === "nom") {
			setLoading(true);
			try {
				const trimmedText = text.trim();
				const isUsed = await isUsernameAlreadyUsed(trimmedText);
				setUsernameError(isUsed);

				if (isUsed) {
					setShowError(true);
					setLoading(false);
					return;
				}

				if (!isValidName(trimmedText)) {
					setShowError(true);
					setLoading(false);
					return;
				}
			} catch (error) {
				console.error("Erreur lors de la vérification :", error);
				setShowError(true);
				setLoading(false);
				return;
			}
		}

		const answer: Answer = {
			answer: text.trim(),
			value: 1,
		};
		goToNextQuestion(answer);
		resetText();
		setLoading(false);
	};

	return (
		<View className="w-full flex flex-col justify-between">
			<CustomTextInput
				label={question}
				placeholder="Votre réponse"
				autoFocus={true}
				value={text}
				onChangeText={handleTextChange}
				onFocus={() => setShowError(false)}
				textColor={"white"}
				returnKeyType="next"
				keyboardType={slug === "email" ? "email-address" : "default"}
			/>

			<ButtonNext
				selectedAnswer={text}
				goToNextQuestion={goNext}
				isDisabled={loading}
				isSubmitting={loading}
			/>
			{showError && (
				<View
					className="mx-auto rounded-2xl mt-1 mb-4 p-3 flex flex-row items-center w-full"
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
					<Text style={{ color: theme.colors.redPrimary }} className="ml-2">
						{usernameError
							? "Nom d'utilisateur déjà utilisé"
							: slug === "email"
							? "Veuillez entrer un email valide"
							: "Veuillez renseigner ce champ correctement"}
					</Text>
				</View>
			)}
		</View>
	);
}
