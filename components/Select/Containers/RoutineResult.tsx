import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "@type/habit";
import { lightenColor } from "@utils/colors";
import { Answers } from "@utils/formRoutine";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

type RoutineResultProps = {
	foundHabits: Habit[];
	selectedHabits: string[];
	toggleHabitSelection: (habitId: string) => void;
	setAnswers: (answers: Answers) => void;
	addHabits: () => void;
};

const RoutineResult = ({
	foundHabits,
	selectedHabits,
	toggleHabitSelection,
	setAnswers,
	addHabits,
}: RoutineResultProps) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const { habits } = useData();
	const [allSelected, setAllSelected] = useState(false);

	const habitAlreadyExist = (habitId: string) => {
		return habits.some((habit) => habit.habitId === habitId);
	};

	const toggleAllHabits = () => {
		if (allSelected) {
			foundHabits.forEach((habit) => {
				if (!habitAlreadyExist(habit.id) && selectedHabits.includes(habit.id)) {
					toggleHabitSelection(habit.id);
				}
			});
		} else {
			foundHabits.forEach((habit) => {
				if (!habitAlreadyExist(habit.id) && !selectedHabits.includes(habit.id)) {
					toggleHabitSelection(habit.id);
				}
			});
		}
		setAllSelected(!allSelected);
	};

	return (
		<View className="w-full mx-auto justify-between h-full">
			<View className="flex flex-col gap-4 w-full">
				<Text
					className="text-xl mb-2 font-semibold w-11/12 mx-auto"
					style={{ color: theme.colors.text }}
				>
					{t("routine_result_description")}
				</Text>

				<View className="flex flex-col gap-1 w-full mx-auto">
					<Pressable
						onPress={toggleAllHabits}
						className="flex flex-row items-center gap-2 py-3"
					>
						<Ionicons
							name={allSelected ? "checkmark-circle" : "ellipse-outline"}
							size={30}
							color={theme.colors.primary}
						/>
						<Text style={{ color: theme.colors.text }} className="font-semibold">
							{allSelected ? t("unselect_all") : t("select_all")}
						</Text>
					</Pressable>
					{foundHabits.length > 0 ? (
						foundHabits.map((habit, index) => (
							<View
								key={index}
								className="flex flex-row items-center gap-4 w-full mx-auto"
							>
								<Pressable
									key={index}
									className="flex flex-row items-center gap-2 py-3"
									onPress={() => toggleHabitSelection(habit.id)}
									disabled={habitAlreadyExist(habit.id)}
								>
									<Ionicons
										name={
											selectedHabits.includes(habit.id) || habitAlreadyExist(habit.id)
												? "checkmark-circle"
												: "ellipse-outline"
										}
										size={30}
										color={
											selectedHabits.includes(habit.id)
												? theme.colors.primary
												: theme.colors.text
										}
									/>
								</Pressable>
								<View
									style={{
										backgroundColor: habitAlreadyExist(habit.id)
											? theme.colors.cardBackground
											: lightenColor(habit.category.color, 0.2),
									}}
									className="flex flex-row items-center gap-2 p-3 rounded-lg flex-1"
								>
									<Text
										className="text-[16px] font-semibold ml-2"
										style={{ color: theme.colors.text }}
									>
										{habit.name}
									</Text>
								</View>
							</View>
						))
					) : (
						<Text style={{ color: theme.colors.text }}>{t("no_habits_found")}</Text>
					)}
				</View>
			</View>

			<View className="flex flex-col gap-3 my-4">
				<View className="flex flex-row items-center gap-2">
					<Iconify icon="mdi:check-circle" size={20} color={theme.colors.primary} />
					<Text className="text-lg">
						{t("selected_habits")} : {selectedHabits.length}
					</Text>
				</View>
				<View className="flex flex-row gap-3 mb-2 items-center justify-between w-full">
					<Pressable
						onPress={() => addHabits()}
						className=" flex flex-row gap-4 items-center flex-1 justify-center p-4 rounded-xl"
						style={{
							backgroundColor:
								selectedHabits.length > 0 ? theme.colors.primary : theme.colors.border,
						}}
					>
						<Text
							className=" font-semibold"
							style={{
								color:
									selectedHabits.length > 0
										? theme.colors.textSecondary
										: theme.colors.text,
							}}
						>
							{t("add_habits")}
						</Text>
						<Iconify
							icon="mdi:plus"
							size={20}
							color={
								selectedHabits.length > 0
									? theme.colors.textSecondary
									: theme.colors.text
							}
						/>
					</Pressable>
					<Pressable
						onPress={() => addHabits()}
						className=" flex flex-row gap-4 items-center justify-center p-4 flex-1 rounded-xl"
						style={{
							backgroundColor: theme.colors.cardBackground,
						}}
					>
						<Text className="font-semibold" style={{ color: theme.colors.text }}>
							{t("skip")}
						</Text>
						<Iconify icon="mdi:arrow-right" size={20} color={theme.colors.text} />
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default RoutineResult;
