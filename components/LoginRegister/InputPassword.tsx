import React, { useContext, useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { ThemeContext } from "@context/ThemeContext";
import { Answer } from "../../constants/Slides";
import ButtonNext from "@components/LoginRegister/ButtonNext";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";
import { Iconify } from "react-native-iconify";

export default function InputPassword({
	question,
	goToNextQuestion,
}: {
	question: string;
	goToNextQuestion: (answer: Answer) => void;
}) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [showInfoMessage, setShowInfoMessage] = useState(true);
	const { theme } = useContext(ThemeContext);

	const resetText = () => {
		setPassword("");
		setConfirmPassword("");
		setIsEmpty(true);
		setShowError(false);
		setPasswordsMatch(true);
		setShowInfoMessage(true);
	};

	useEffect(() => {
		resetText();
	}, [question]);

	const handlePasswordChange = (inputText: string) => {
		setPassword(inputText);
		setIsEmpty(inputText.trim().length < 6 || inputText !== confirmPassword);
		setShowInfoMessage(inputText.trim().length < 6);
	};

	const handleConfirmPasswordChange = (inputText: string) => {
		setConfirmPassword(inputText);
		setPasswordsMatch(inputText === password);
		setIsEmpty(password.trim().length < 6 || inputText !== password);
		setShowInfoMessage(password.trim().length < 6);
	};

	const goNext = () => {
		if (!isEmpty) {
			const answer: Answer = {
				answer: password,
				value: 1,
			};
			goToNextQuestion(answer);
		} else {
			setShowError(true);
		}
	};

	return (
		<View className="w-full flex flex-col justify-between">
			<Text
				style={{ color: "white" }}
				className="mb-2 ml-2 font-semibold text-[16px]"
			>
				{question}
			</Text>
			<CustomPasswordInput
				label="Mot de passe"
				placeholder="********"
				value={password}
				onChangeText={handlePasswordChange}
				secureTextEntry={!showPassword}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				textColor="white"
			/>
			<CustomPasswordInput
				label="Confirmer le mot de passe"
				placeholder="********"
				value={confirmPassword}
				onChangeText={handleConfirmPasswordChange}
				secureTextEntry={!showPassword}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				textColor="white"
			/>

			{showInfoMessage && (
				<View
					className="flex flex-row p-1 mb-1 mt-5 items-center justify-center w-full  rounded-xl"
					style={{ backgroundColor: theme.colors.blueSecondary }}
				>
					<Iconify icon="tabler:info-circle" color="black" size={24} />
					<Text className="ml-2">
						Le mot de passe doit comporter au moins 6 caractères.
					</Text>
				</View>
			)}
			<ButtonNext
				selectedAnswer={password}
				goToNextQuestion={goNext}
				isDisabled={isEmpty}
				label="Créer mon compte"
			/>
			{showError && (
				<Text style={{ color: "red", textAlign: "center" }}>
					{!passwordsMatch
						? "Les mots de passe ne correspondent pas."
						: "Le mot de passe doit comporter au moins 6 caractères."}
				</Text>
			)}
		</View>
	);
}
