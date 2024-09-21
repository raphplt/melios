import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { Goal } from "@type/goal";
import { Habit } from "@type/habit";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { Iconify } from "react-native-iconify";

export default function CurrentGoal({ goal }: { goal: Goal }) {
	const { theme } = useContext(ThemeContext);
	const { width } = Dimensions.get("window");
	const { getHabitDetails, getUserHabitDetails, userHabits } = useIndex();
	const [habit, setHabits] = useState<Habit>();
	const [userHabit, setUserHabit] = useState<UserHabit>();
	const [goalStreak, setGoalStreak] = useState(0);
	const [isCompletedToday, setIsCompletedToday] = useState(false);

	useEffect(() => {
		async function getHabitInfos() {
			const habit = getHabitDetails(goal.habitId);
			setHabits(habit);
			const userHabit = getUserHabitDetails(goal.habitId);
			setUserHabit(userHabit);
		}
		getHabitInfos();
	}, [userHabits]);

	useEffect(() => {
		if (userHabit && goal) {
			const startDate = new Date(goal.createdAt.seconds * 1000);
			let streak = 0;
			let completedToday = false;
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			for (let i = 0; i < goal.duration; i++) {
				const currentDate = new Date(startDate);
				currentDate.setDate(startDate.getDate() + i);

				const log = userHabit.logs.find(
					(log) => new Date(log.date).toDateString() === currentDate.toDateString()
				);

				if (log && log.done) {
					streak++;
					if (currentDate.toDateString() === today.toDateString()) {
						completedToday = true;
					}
				} else {
					break;
				}
			}

			setGoalStreak(streak);
			setIsCompletedToday(completedToday);
		}
	}, [userHabit, goal]);

	if (!habit || !userHabit) return null;

	const lightColor = lightenColor(
		habit.category.color || theme.colors.primary,
		0.1
	);

	return (
		<View
			className="rounded-xl flex-1 my-1"
			style={{
				width: width,
			}}
		>
			<View
				style={{
					flex: 1,
					width: width * 0.95,
					backgroundColor: lightColor || theme.colors.cardBackground,
					borderColor: habit.category.color || theme.colors.primary,
					borderWidth: 2,
				}}
				className="mx-auto rounded-xl flex px-3 py-3"
			>
				<View className="flex justify-between flex-row">
					<View className="flex flex-row items-center">
						<FontAwesome6
							name={habit.category.icon || "question"}
							size={18}
							color={habit.category.color || theme.colors.text}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[15px] font-semibold ml-2 "
						>
							{habit?.name}
						</Text>
					</View>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="font-bold text-[16px]"
					>
						{goalStreak}/{goal.duration}
					</Text>
				</View>
				<View className="flex items-center justify-end flex-row mt-1">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-[14px]"
					>
						Aujourd'hui
					</Text>
					{isCompletedToday ? (
						<Iconify icon="mdi:check" size={20} color={theme.colors.primary} />
					) : (
						<Iconify icon="mdi:close" size={20} color={theme.colors.redPrimary} />
					)}
				</View>
			</View>
		</View>
	);
}
