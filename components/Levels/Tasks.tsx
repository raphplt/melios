import CardCheckHabit from "@components/Habits/CardCheckHabit";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

const Tasks = () => {
	const { habits } = useData();
	const { selectedLevel } = useData();
	const { categories } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();

	if (!selectedLevel) return null;
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const filteredHabits = habits.filter((habit) => {
		const category = categories.find(
			(category) => category.category === habit.category
		) || { id: "" };
		const categoryId = category?.id || "";
		const categoryIdNumber = Number(categoryId);
		const isIncluded = selectedLevel.associatedCategoryIds.includes(
			categoryIdNumber as any
		);
		return isIncluded;
	});

	return (
		<View className="mb-10">
			<Text
				className="text-lg font-semibold mt-5 mb-2 mx-auto w-10/12 py-3"
				style={{
					color: theme.colors.textTertiary,
				}}
			>
				{filteredHabits.length} {t("linked_habits")} :
			</Text>
			<>
				{filteredHabits.length > 0 &&
					filteredHabits.map((habit) => (
						<CardCheckHabit habit={habit} key={habit.id} />
					))}
				<Pressable
					className="w-10/12 mx-auto rounded-3xl py-3 px-4 mt-6 flex flex-row items-center justify-center"
					style={{
						backgroundColor: theme.colors.primary,
					}}
					onPress={() => navigation.navigate("(select)")}
				>
					<Text
						style={{
							color: "#fff",
						}}
						className="text-center text-lg font-semibold mr-2"
					>
						{t("add_habit")}
					</Text>
					<Iconify icon="material-symbols:add" size={20} color="#fff" />
				</Pressable>
			</>
		</View>
	);
};

export default Tasks;
