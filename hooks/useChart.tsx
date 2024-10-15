import { useData } from "@context/DataContext";
import { useEffect, useState } from "react";
import { getTodayScore } from "@components/Home/ParallaxScrollView";
import { calculateWeeklyStreak } from "@utils/progressionUtils";

const convertAnswer = (answer: number) => {
	switch (answer) {
		case 1:
			return 10;
		case 2:
			return 20;
		case 3:
			return 30;
		default:
			return 0;
	}
};

const useChart = () => {
	const { completedHabitsToday, habits, member, logs } = useData();
	const [todayTime, setTodayTime] = useState(0);

	let todayScore = 0;
	let weeklyStreak = 0;
	let timePerDay = 0;
	let parsedTime = 0;
	let regularity = 0;

	useEffect(() => {
		if (completedHabitsToday) {
			const todayTime = completedHabitsToday.reduce((acc, habit) => {
				return acc + habit.duration;
			}, 0);
			setTodayTime(todayTime);
		}
	}, [completedHabitsToday]);

	try {
		if (!habits || !completedHabitsToday) {
			throw new Error("Habits or completedHabitsToday data is missing");
		}

		todayScore = getTodayScore(habits, completedHabitsToday) / 100;

		if (!logs) {
			throw new Error("Logs data is missing");
		}

		weeklyStreak = calculateWeeklyStreak(logs);

		timePerDay = convertAnswer(member?.temps.value || 0);
		if (todayTime && timePerDay && timePerDay !== 0) {
			parsedTime = todayTime / timePerDay > 1 ? 1 : todayTime / timePerDay;
		}

		if (weeklyStreak) {
			regularity = weeklyStreak / 7 > 1 ? 1 : weeklyStreak / 7;
		} else {
			regularity = 0;
		}
	} catch (error) {
		console.error("Error in useChart hook:", error);
		todayScore = 0;
		weeklyStreak = 0;
		timePerDay = 1;
		parsedTime = 0;
		regularity = 0;
	}

	return {
		todayTime,
		timePerDay,
		parsedTime,
		todayScore,
		weeklyStreak,
		regularity,
	};
};

export default useChart;