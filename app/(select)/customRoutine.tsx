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

interface Answers {
	[key: string]: string;
}

const CustomRoutineForm = () => {
	const { theme } = useTheme();
	const { habitsData } = useHabits();
	const { member, setHabits } = useData();

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

	const toggleHabitSelection = (habitId: string) => {
		setSelectedHabits((prevSelected) =>
			prevSelected.includes(habitId)
				? prevSelected.filter((id) => id !== habitId)
				: [...prevSelected, habitId]
		);
	};

	const addHabits = async () => {
		const habitsFromSelected = foundHabits.filter((habit) =>
			selectedHabits.includes(habit.id)
		);
		if (member) {
			const habits: UserHabit[] = (await addMultipleUserHabits(
				member,
				habitsFromSelected
			)) as any;
			if (habits) setHabits((prev: UserHabit[]) => [...prev, ...habits]);
		}
	};

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 40 }}
		>
			<ButtonClose />
			<View
				className="flex-1 p-4 h-screen flex flex-col items-center justify-between"
				style={{ backgroundColor: theme.colors.background }}
			>
				{loading ? (
					<LoaderResult />
				) : currentQuestionIndex < formRoutines.length ? (
					<>
						{/* Barre de progression */}
						<View
							className="h-2 rounded-full mb-5 overflow-hidden w-[95%] mx-auto"
							style={{ backgroundColor: theme.colors.border }}
						>
							<View
								className="h-full rounded-full"
								style={{ width: `${progress}%`, backgroundColor: theme.colors.primary }}
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

						{/* Boutons Précédent / Suivant */}
						<View className="flex-row justify-between w-10/12 mb-5">
							<TouchableOpacity
								onPress={handlePrevious}
								disabled={currentQuestionIndex === 0}
								className={`p-3 rounded-2xl items-center flex flex-row gap-2`}
								style={{
									backgroundColor:
										currentQuestionIndex === 0
											? theme.colors.grayPrimary
											: theme.colors.border,
								}}
							>
								<Iconify icon="mdi:arrow-left" size={20} color={theme.colors.text} />
								<Text
									className="font-semibold"
									style={{
										color: currentQuestionIndex === 0 ? "gray" : theme.colors.text,
									}}
								>
									Précédent
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleNext}
								className="p-3 rounded-2xl items-center flex flex-row gap-2"
								style={{ backgroundColor: theme.colors.backgroundTertiary }}
								disabled={!answers[currentQuestion.id]}
							>
								<Text className="font-semibold" style={{ color: theme.colors.text }}>
									{currentQuestionIndex === formRoutines.length - 1
										? "Soumettre"
										: "Suivant"}
								</Text>
								<Iconify icon="mdi:arrow-right" size={20} color={theme.colors.text} />
							</TouchableOpacity>
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
	);
};

export default CustomRoutineForm;
