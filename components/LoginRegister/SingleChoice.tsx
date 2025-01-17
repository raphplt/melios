import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";
import RegisterPressable from "./RegisterPressable";
import ButtonNext from "@components/LoginRegister/ButtonNext";
import { Answer } from "../../constants/Slides";

export default function SingleChoice({
	question,
	answers,
	goToNextQuestion,
}: {
	question: string;
	answers: any;
	goToNextQuestion: (selectedAnswer: Answer) => void;
}) {
	const { theme } = useContext(ThemeContext);
	const [selectedAnswer, setSelectedAnswer] = useState<Answer>();

	const goNext = () => {
		if (selectedAnswer) {
			goToNextQuestion(selectedAnswer);
			setSelectedAnswer(undefined);
		}
	};

	return (
		<View className="w-full flex flex-col justify-between">
			<Text
				style={{ color: theme.colors.textSecondary }}
				className="text-[18px] my-4 w-11/12 font-semibold mx-auto leading-6 break-words "
			>
				{question}
			</Text>
			<View className="flex flex-col">
				{answers.map((answer: any, index: any) => (
					<RegisterPressable
						key={index}
						text={answer.answer}
						onPress={() => setSelectedAnswer(answer)}
						icon={
							<Iconify
								icon="tabler:circle-check"
								color={
									selectedAnswer === answer
										? theme.colors.primary
										: theme.colors.grayPrimary
								}
								size={24}
							/>
						}
						selected={selectedAnswer === answer}
					/>
				))}
			</View>

			<ButtonNext selectedAnswer={selectedAnswer} goToNextQuestion={goNext} />
		</View>
	);
}
