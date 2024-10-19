import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { Answer } from "../../constants/Slides";
import ButtonNext from "@components/LoginRegister/ButtonNext";
import CustomPasswordInput from "@components/Shared/CustomPasswordInput";

export default function InputPassword({
	question,
	goToNextQuestion,
	isCreatingUser, // Recevoir l'état
}: {
	question: string;
	goToNextQuestion: (answer: Answer) => void;
	isCreatingUser: boolean; // Définir le type
}) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [showInfoMessage, setShowInfoMessage] = useState(true);

	const confirmPasswordRef = useRef<TextInput>(null);

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
		<View>
			<Text
				style={{ color: "white" }}
				className="mb-2 ml-2 font-semibold text-center text-[16px]"
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
				returnKeyType="next"
				autoFocus={true}
				onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
				returnKeyLabel="done"
				ref={confirmPasswordRef}
			/>

			<ButtonNext
				selectedAnswer={password}
				goToNextQuestion={goNext}
				isDisabled={isEmpty || isCreatingUser}
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
