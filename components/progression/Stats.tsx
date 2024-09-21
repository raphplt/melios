import { View } from "react-native";
import StatCard from "./StatCard";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import useIndex from "@hooks/useIndex";
import moment from "moment";
import { getHabitPoints } from "@utils/pointsUtils";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";

export default function Stats() {
	const { theme } = useContext(ThemeContext);
	const { completedHabitsData, getHabitDetails } = useIndex();
	const today = moment().format("YYYY-MM-DD");
	const [todayScore, setTodayScore] = useState(0);
	const countedHabits = new Set();

	useEffect(() => {
		for (const habit of completedHabitsData) {
			if (habit.logs) {
				const logForToday = habit.logs.find(
					(log) => log.date === today && log.done
				);
				if (logForToday && !countedHabits.has(habit.id)) {
					const habitDetails = getHabitDetails(habit.id);
					if (habitDetails) {
						setTodayScore((prev) => prev + getHabitPoints(habitDetails).rewards);
						countedHabits.add(habit.id);
					}
				}
			}
		}
	}, [completedHabitsData]);

	return (
		<View
			className="flex flex-row justify-center w-full py-8 rounded-b-3xl"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<StatCard
				title="Complétées aujourd'hui"
				value={String(completedHabitsData.length)}
			/>
			<StatCard
				title="Gain du jour"
				value={String(todayScore)}
				icon={<MoneyOdyssee />}
			/>
		</View>
	);
}
