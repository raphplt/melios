import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemeContext";

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

const handleTextChange = (inputText: string) => {
	setText(inputText);
	setIsEmpty(inputText.trim().length <= 1);
};

return (
	<View className="w-screen">
		<Text
			style={{ color: theme.colors.text }}
			className="text-xl text-center mb-4"
		>
			{props.question}
		</Text>
		<TextInput
			placeholderTextColor={"#333333"}
			className="text-lg w-10/12 mx-auto pl-2 py-5 pb-1 border-b-2 "
			style={{
				color: theme.colors.text,
			}}
			onChangeText={handleTextChange}
			value={text}
		/>
		<Pressable
			className={`text-white font-bold py-2 px-4 rounded-2xl my-3 mt-12 w-11/12 mx-auto ${
				isEmpty ? "opacity-50" : ""
			}`}
			style={{ backgroundColor: theme.colors.primary }}
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
