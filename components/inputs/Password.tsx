import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Button, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function InputPassword(props: any) {
	const { theme } = useContext(ThemeContext);
	const [password, setPassword] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);
	const [showPassword, setShowPassword] = useState(false); 

	const resetText = () => {
		setPassword("");
		setIsEmpty(true);
		setShowError(false);
	};

	useEffect(() => {
		resetText();
	}, [props.question]);

	const handlePasswordChange = (inputText: string) => {
		setPassword(inputText);
		setIsEmpty(inputText.trim().length < 6);
	};

	return (
		<View className="w-3/4 mx-auto">
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
					style={{
						flex: 1,
						color: theme.colors.text,
						backgroundColor: theme.colors.backgroundSecondary,
						borderRadius: 10,
						paddingHorizontal: 10,
						paddingVertical: 5,
						fontSize: 16,
					}}
					onChangeText={handlePasswordChange}
					value={password}
					secureTextEntry={!showPassword}
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
				className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-2xl my-3 mt-12 ${
					isEmpty ? "opacity-50" : ""
				}`}
				onPress={() => {
					if (!isEmpty) {
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
					Le mot de passe doit comporter au moins 6 caractères.
				</Text>
			)}
		</View>
	);
}