import { Habit } from "@type/habit";
import { getHabitPoints } from "./pointsUtils";
import { UserHabit } from "@type/userHabit";

export const calcReward = ({
	duration,
	habit,
}: {
	duration: number;
	habit: UserHabit;
}) => {
	return Math.round(getHabitPoints(habit).rewards * duration);
};
