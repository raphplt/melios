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
	const { completedHabitsToday, habits } = useData();
	const { member } = useData();
	const todayScore = getTodayScore(habits, completedHabitsToday) / 100;
	const { logs } = useData();

	const weeklyStreak = calculateWeeklyStreak(logs);

	const [todayTime, setTodayTime] = useState(0);
	const timePerDay = convertAnswer(member?.temps.value || 0);
    const parsedTime = todayTime / timePerDay > 1 ? 1 : todayTime / timePerDay;

				const regularity = weeklyStreak / 7 > 1 ? 1 : weeklyStreak / 7;

				useEffect(() => {
					const todayTime = completedHabitsToday.reduce((acc, habit) => {
						return acc + habit.duration;
					}, 0);
					setTodayTime(todayTime);
				}, [completedHabitsToday]);

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
