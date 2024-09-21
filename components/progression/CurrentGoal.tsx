import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { Goal } from "@type/goal";
import { Habit } from "@type/habit";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";

export default function CurrentGoal({ goal }: { goal: Goal }) {
	const { theme } = useContext(ThemeContext);
	const { width } = Dimensions.get("window");
	const { getHabitDetails, getUserHabitDetails, userHabits } = useIndex();
	const [habit, setHabits] = useState<Habit>();
	const [userHabit, setUserHabit] = useState<UserHabit>();
	const [goalStreak, setGoalStreak] = useState(0);

	useEffect(() => {
		async function getHabitInfos() {
			const habit = getHabitDetails(goal.habitId);
			setHabits(habit);
			const userHabit = getUserHabitDetails(goal.habitId);
			setUserHabit(userHabit);
		}
		getHabitInfos();
	}, [userHabits]);

	console.log("Goal: ", goal);
	console.log("Date de création du goal: ", goal.createdAt);
	console.log("Logs de l'habitude: ", userHabit?.logs);

	return (
		<View
			className="rounded-xl flex-1"
			style={{
				width: width,
			}}
		>
			<View
				style={{
					flex: 1,

					width: width * 0.9,
					backgroundColor: theme.colors.cardBackground,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				className="mx-auto rounded-xl flex items-center"
			>
				<Text
					style={{
						color: theme.colors.text,
					}}
				>
					{habit?.name}
				</Text>
				<Text>Durée : {goal.duration} Jours</Text>
			</View>
		</View>
	);
}
