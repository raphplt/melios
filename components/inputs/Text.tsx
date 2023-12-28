import { useContext, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { ThemeContext } from "../ThemContext";

export default function InputText(props: any) {
	const { theme } = useContext(ThemeContext);
	const [text, setText] = useState("");

	return (
		<View>
			<Text style={{ color: theme.colors.text }}>{props.question}</Text>
			<TextInput
				style={{ color: theme.colors.text }}
				onChangeText={(text) => setText(text)}
				value={text}
			/>
			<Button
				title="Valider"
				onPress={() => {
					props.setAnswers([...props.answers, text]);
					props.goToNextQuestion();
				}}
			/>
		</View>
	);
}
