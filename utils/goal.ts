import { Habit } from "@type/habit";
import { getHabitPoints } from "./pointsUtils";

export const calcReward = ({
	duration,
	habit,
}: {
	duration: number;
	habit: Habit;
}) => {
	return Math.round(getHabitPoints(habit).rewards * duration);
};
