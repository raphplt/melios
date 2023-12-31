import React, { useState, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";

export default function MultipleChoice(props: any) {
	const { theme } = useContext(ThemeContext);

	const [selectedAnswers, setSelectedAnswers]: any = useState([]);

	const toggleAnswer = (answer: any) => {
		if (selectedAnswers.includes(answer)) {
			setSelectedAnswers((prevSelected: any) =>
				prevSelected.filter((selected: any) => selected !== answer)
			);
		} else {
			setSelectedAnswers((prevSelected: any) => [...prevSelected, answer]);
		}
	};
	
	return (
		<View>
			<Text
				style={{ color: theme.colors.text }}
				className="text-xl text-center mb-4"
			>
				{props.question}
			</Text>
			{props.answers.map((answer: any, index: any) => (
				<Pressable
					key={index}
					onPress={() => toggleAnswer(answer)}
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? theme.colors.background
								: theme.colors.backgroundSecondary,
							borderColor: theme.colors.text,
							borderWidth: 1,
							borderRadius: 20,
							flexDirection: "row",
							alignItems: "center",
							padding: 10,
							marginVertical: 7,
						},
					]}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 10,
							backgroundColor: selectedAnswers.includes(answer)
								? theme.colors.activeSwitch
								: theme.colors.inactiveSwitch,
							marginRight: 10,
							borderWidth: 1,
							borderColor: theme.colors.text,
						}}
					/>
					<Text style={{ color: theme.colors.text }} className="text-lg">
						{answer.answer}
					</Text>
				</Pressable>
			))}

			<Pressable
				className="bg-blue-500 text-white font-bold py-2 px-4 rounded-2xl my-3 mt-12"
				onPress={() => {
					props.goToNextQuestion(selectedAnswers);
				}}
			>
				<Text style={{ color: theme.colors.text }} className="text-lg text-center">
					Continuer
				</Text>
			</Pressable>
		</View>
	);
}
