import React, { useState, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

export default function SingleChoice(props: any) {
	const { theme } = useContext(ThemeContext);
	const [selectedAnswer, setSelectedAnswer]: any = useState(null);

	return (
		<View className="w-screen">
			<Text
				style={{ color: theme.colors.text }}
				className="text-xl text-center mb-4 w-11/12 mx-auto"
			>
				{props.question}
			</Text>
			{props.answers.map((answer: any, index: any) => (
				<Pressable
					key={index}
					onPress={() => setSelectedAnswer(answer)}
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? theme.colors.background
								: theme.colors.backgroundSecondary,
							borderColor: theme.colors.border,
							borderWidth: 1,
							borderRadius: 15,
							flexDirection: "row",
							alignItems: "center",
							padding: 10,
							marginVertical: 7,
							width: "90%",
							alignSelf: "center",
						},
					]}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 10,
							backgroundColor:
								selectedAnswer === answer
									? theme.colors.primary
									: theme.colors.cardBackground,
							marginRight: 10,
							borderWidth: 1,
							borderColor: theme.colors.primary,
						}}
					/>
					<Text style={{ color: theme.colors.text }} className="text-[16px]">
						{answer.answer}
					</Text>
				</Pressable>
			))}
			<Pressable
				className=" text-white font-bold py-2 px-4 rounded-2xl my-3 mt-12 w-11/12 mx-auto"
				style={{ backgroundColor: theme.colors.primary }}
				onPress={() => {
					if (selectedAnswer) {
						props.goToNextQuestion(selectedAnswer);
					}
				}}
				disabled={!selectedAnswer}
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-lg text-center"
				>
					Continuer
				</Text>
			</Pressable>
		</View>
	);
}
