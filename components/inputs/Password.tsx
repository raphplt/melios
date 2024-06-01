import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Button, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function InputPassword(props: any) {
	const { theme } = useContext(ThemeContext);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	const resetText = () => {
		setPassword("");
		setConfirmPassword("");
		setIsEmpty(true);
		setShowError(false);
		setPasswordsMatch(true);
	};

	useEffect(() => {
		resetText();
	}, [props.question]);

	const handlePasswordChange = (inputText: string) => {
		setPassword(inputText);
		setIsEmpty(inputText.trim().length < 6 || inputText !== confirmPassword);
	};

	const handleConfirmPasswordChange = (inputText: string) => {
		setConfirmPassword(inputText);
		setPasswordsMatch(inputText === password);
		setIsEmpty(password.trim().length < 6 || inputText !== password);
	};

	return (
		<View className="w-screen">
			<Text
				style={{ color: theme.colors.text }}
				className="text-xl text-center mb-4"
			>
				{props.question}
			</Text>
			<View
				style={{ flexDirection: "row", alignItems: "center", position: "relative" }}
			>
				<TextInput
					placeholderTextColor={"#333333"}
					className="text-lg w-10/12 mx-auto pl-2 py-5 pb-1 border-b-2 "
					style={{
						color: theme.colors.text,
					}}
					onChangeText={handlePasswordChange}
					value={password}
					secureTextEntry={!showPassword}
					placeholder="Mot de passe"
				/>
				<Pressable
					onPress={() => setShowPassword(!showPassword)}
					style={{
						position: "absolute",
						right: 10,
						padding: 5,
					}}
				>
					<FontAwesome5
						name={showPassword ? "eye-slash" : "eye"}
						size={20}
						color={theme.colors.text}
					/>
				</Pressable>
			</View>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					position: "relative",
					marginTop: 10,
				}}
			>
				<TextInput
					placeholderTextColor={"#333333"}
					className="text-lg w-10/12 mx-auto pl-2 py-5 pb-1 border-b-2 "
					style={{
						color: theme.colors.text,
					}}
					onChangeText={handleConfirmPasswordChange}
					value={confirmPassword}
					secureTextEntry={!showPassword}
					placeholder="Confirmer le mot de passe"
				/>
				<Pressable
					onPress={() => setShowPassword(!showPassword)}
					style={{
						position: "absolute",
						right: 10,
						padding: 5,
					}}
				>
					<FontAwesome5
						name={showPassword ? "eye-slash" : "eye"}
						size={20}
						color={theme.colors.text}
					/>
				</Pressable>
			</View>

			<Pressable
				className={`text-white font-bold py-2 px-4 rounded-2xl my-3 mt-12 w-11/12 mx-auto ${
					isEmpty ? "opacity-50" : ""
				}`}
				style={{ backgroundColor: theme.colors.primary }}
				onPress={() => {
					if (!isEmpty && passwordsMatch) {
						props.goToNextQuestion(password);
					} else {
						setShowError(true);
					}
				}}
				disabled={isEmpty}
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-lg text-center"
				>
					Créer mon compte
				</Text>
			</Pressable>
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
