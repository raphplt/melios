import CardCheckHabit from "@components/Habits/CardCheckHabit";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const Tasks = () => {
	const { habits } = useData();
	const { selectedLevel } = useData();
	const { categories } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();

	if (!selectedLevel) return null;

	const filteredHabits = habits.filter((habit) => {
		const category = categories.find(
			(category) => category.category === habit.category
		);
		const categoryId = category?.id || "";
		const categoryIdNumber = Number(categoryId);
		const isIncluded = selectedLevel.associatedCategoryIds.includes(
			categoryIdNumber as any
		);
		return isIncluded;
	});

	return (
		<View>
			<Text
				className="text-lg font-semibold mt-5 mb-2 mx-auto w-10/12 py-3"
				style={{
					color: theme.colors.textTertiary,
				}}
			>
				{filteredHabits.length} {t("linked_habits")} :
			</Text>
			<>
				{filteredHabits.map((habit) => (
					<CardCheckHabit habit={habit} key={habit.id} />
				))}
			</>
		</View>
	);
};

export default Tasks;
