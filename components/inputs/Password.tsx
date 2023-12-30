import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Button, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";

export default function InputPassword(props: any) {
	const { theme } = useContext(ThemeContext);
	const [password, setPassword] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);

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
		setIsEmpty(inputText.trim() === "");
	};

	return (
		<View className="w-3/4 mx-auto">
			<Text
				style={{ color: theme.colors.text }}
				className="text-xl text-center mb-4"
			>
				{props.question}
			</Text>
			<TextInput
				className="rounded-lg my-3 py-2 px-3 text-lg"
				style={{
					color: theme.colors.text,
					backgroundColor: theme.colors.backgroundSecondary,
				}}
				onChangeText={handlePasswordChange}
				value={password}
			/>
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
				<Text style={{ color: theme.colors.text }} className="text-lg text-center">
					Finir
				</Text>
			</Pressable>
			{showError && (
				<Text style={{ color: "red", textAlign: "center" }}>
					Le champ ne peut pas être vide.
				</Text>
			)}
		</View>
	);
}
