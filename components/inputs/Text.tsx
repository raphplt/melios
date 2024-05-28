import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";

export default function InputText(props: any) {
	const { theme } = useContext(ThemeContext);
	const [text, setText] = useState("");
	const [isEmpty, setIsEmpty] = useState(true);
	const [showError, setShowError] = useState(false);

	const resetText = () => {
		setText("");
		setIsEmpty(true);
		setShowError(false);
	};

	useEffect(() => {
		resetText();
	}, [props.question]);

	// Fonction pour gérer le changement de texte
	const handleTextChange = (inputText: string) => {
		setText(inputText);
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
				onChangeText={handleTextChange}
				value={text}
			/>
			<Pressable
				className={`bg-blue-500 text-white font-bold py-3 px-4 rounded-2xl my-3 mt-12 ${
					isEmpty ? "opacity-50" : ""
				}`}
				onPress={() => {
					if (!isEmpty) {
						props.goToNextQuestion(text);
					} else {
						setShowError(true);
					}
				}}
				disabled={isEmpty}
			>
				<Text style={{ color: theme.colors.textSecondary }} className="text-center">
					Continuer
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
