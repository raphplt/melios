import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { formRoutines } from "@constants/formRoutine";
import ButtonClose from "@components/Shared/ButtonClose";
import { Iconify } from "react-native-iconify";
import { UserHabit } from "@type/userHabit";
import { useHabits } from "@context/HabitsContext";
import {
	addMultipleUserHabits,
	getRecommendedHabits,
} from "@utils/formRoutine";
import RoutineResult from "@components/Select/Containers/RoutineResult";
import LoaderResult from "@components/Select/Items/LoaderResult";
import { Habit } from "@type/habit";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";

interface Answers {
	[key: string]: string;
}

const CustomRoutineForm = () => {
	const { theme } = useTheme();
	const { habitsData } = useHabits();
	const { member, setHabits } = useData();
	const { t } = useTranslation();

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});
	const [foundHabits, setFoundHabits] = useState<Habit[]>([]);
	const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const currentQuestion = formRoutines[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / formRoutines.length) * 100;

	const handleAnswerSelect = (answer: string) => {
		setAnswers({
			...answers,
			[currentQuestion.id]: answer,
		});
	};

	const handleNext = () => {
		if (currentQuestionIndex < formRoutines.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setLoading(true);
			setTimeout(() => {
				const snapshot = getRecommendedHabits(answers, habitsData);
				setFoundHabits(snapshot);
				setLoading(false);
				setCurrentQuestionIndex(formRoutines.length);
			}, 2000);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const addHabits = async () => {
		const habitsFromSelected = foundHabits.filter((habit) =>
			selectedHabits.includes(habit?.id)
		);
		if (member) {
			const habits: UserHabit[] = (await addMultipleUserHabits(
				member,
				habitsFromSelected
			)) as any;
			if (habits) setHabits((prev: UserHabit[]) => [...prev, ...habits]);
		}
	};

	const toggleHabitSelection = (habitId: string) => {
		setSelectedHabits((prevSelected) =>
			prevSelected.includes(habitId)
				? prevSelected.filter((id) => id !== habitId)
				: [...prevSelected, habitId]
		);
	};

	console.log("foundHabits", foundHabits);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<ScrollView style={{ flex: 1, paddingTop: 40 }}>
				<ButtonClose />
				<View
					className="flex-1 p-4 flex flex-col items-center justify-between"
					style={{ backgroundColor: theme.colors.background }}
				>
					{loading ? (
						<LoaderResult />
					) : currentQuestionIndex < formRoutines.length ? (
						<>
							{/* Barre de progression */}
							<View className="w-full">
								<Progress.Bar
									progress={progress / 100}
									width={null}
									color={theme.colors.primary}
									unfilledColor={theme.colors.border}
									borderWidth={0}
									borderRadius={10}
									height={10}
									style={{ marginBottom: 20 }}
								/>
							</View>

							{/* Questions du formulaire */}
							<View className="w-[95%] mx-auto">
								<Text
									className="text-xl mb-5 font-semibold"
									style={{ color: theme.colors.text }}
								>
									{currentQuestion.question}
								</Text>
								{currentQuestion.answers.map((answer, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => handleAnswerSelect(answer)}
										className={`p-3 rounded-lg my-2 ${
											answers[currentQuestion.id] === answer ? "bg-primary" : "bg-card"
										}`}
										style={{
											backgroundColor:
												answers[currentQuestion.id] === answer
													? theme.colors.primary
													: theme.colors.cardBackground,
										}}
									>
										<Text
											className="text-lg"
											style={{
												color:
													answers[currentQuestion.id] === answer
														? theme.colors.textSecondary
														: theme.colors.text,
											}}
										>
											{answer}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</>
					) : (
						<RoutineResult
							foundHabits={foundHabits}
							selectedHabits={selectedHabits}
							toggleHabitSelection={toggleHabitSelection}
							setAnswers={setAnswers}
							addHabits={addHabits}
						/>
					)}
				</View>
			</ScrollView>
			{/* Boutons Précédent / Suivant */}
			{currentQuestionIndex < formRoutines.length && (
				<View
					className="flex-row justify-between w-full mb-5 mx-auto px-5"
					style={{
						position: "absolute",
						bottom: 20,
						left: 0,
						right: 0,
					}}
				>
					<TouchableOpacity
						onPress={handlePrevious}
						disabled={currentQuestionIndex === 0}
						className="p-4 rounded-2xl items-center flex flex-row gap-2"
						style={{
							backgroundColor:
								currentQuestionIndex === 0
									? theme.colors.border
									: theme.colors.cardBackground,
						}}
					>
						<Iconify icon="mdi:arrow-left" size={20} color={theme.colors.text} />
						<Text
							className="font-semibold"
							style={{
								color: currentQuestionIndex === 0 ? "gray" : theme.colors.text,
							}}
						>
							{t("form_previous")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleNext}
						className="p-4 rounded-2xl items-center flex flex-row gap-2"
						style={{ backgroundColor: theme.colors.backgroundTertiary }}
						disabled={currentQuestion ? !answers[currentQuestion.id] : false}
					>
						<Text className="font-semibold" style={{ color: theme.colors.text }}>
							{currentQuestionIndex === formRoutines.length - 1
								? t("form_finish")
								: t("form_next")}
						</Text>
						<Iconify icon="mdi:arrow-right" size={20} color={theme.colors.text} />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default CustomRoutineForm;