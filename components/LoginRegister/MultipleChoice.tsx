import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";
import RegisterPressable from "./RegisterPressable";
import ButtonNext from "@components/LoginRegister/ButtonNext";
import { Answer } from "../../constants/Slides";

export default function MultipleChoice({
	question,
	answers,
	goToNextQuestion,
}: {
	question: string;
	answers: any;
	goToNextQuestion: (selectedAnswers: any) => void;
}) {
	const { theme } = useContext(ThemeContext);
	const [selectedAnswers, setSelectedAnswers]: any = useState([]);

	const toggleAnswer = (answer: Answer) => {
		if (selectedAnswers.includes(answer)) {
			setSelectedAnswers((prevSelected: Answer[]) =>
				prevSelected.filter((selected: Answer) => selected !== answer)
			);
		} else {
			setSelectedAnswers((prevSelected: Answer[]) => [...prevSelected, answer]);
		}
	};

	const goNext = () => {
		if (selectedAnswers.length > 0) {
			goToNextQuestion(selectedAnswers);
			setSelectedAnswers([]);
		}
	};

	return (
		<View className=" w-full flex flex-col justify-between">
			<Text
				style={{ color: theme.colors.textSecondary }}
				className="text-[18px] my-4 w-11/12 font-semibold mx-auto leading-6 break-words"
			>
				{question}
			</Text>
			<View className="flex flex-col">
				{answers.map((answer: Answer, index: string) => (
					<RegisterPressable
						key={index}
						text={answer.answer}
						onPress={() => toggleAnswer(answer)}
						icon={
							<Iconify
								icon="tabler:circle-check"
								color={
									selectedAnswers.includes(answer)
										? theme.colors.primary
										: theme.colors.grayPrimary
								}
								size={24}
							/>
						}
						selected={selectedAnswers.includes(answer)}
					/>
				))}
			</View>

			<ButtonNext
				selectedAnswer={selectedAnswers.length > 0 ? selectedAnswers : null}
				goToNextQuestion={goNext}
			/>
		</View>
	);
}
