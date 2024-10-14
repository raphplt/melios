import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";

export const extractPoints = (snapshotRewards: any) => {
	return {
		rewards: snapshotRewards[0]?.rewards ?? 0,
		odyssee: snapshotRewards[0]?.odyssee ?? 0,
	};
};

export const getHabitPoints = (habit?: UserHabit) => {
	if (!habit) return { odyssee: 0, rewards: 0 };
	return {
		odyssee: Math.round(habit.difficulty * 2),
		rewards: habit.difficulty,
	};
};
