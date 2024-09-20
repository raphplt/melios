import { Habit } from "@type/habit";

export const extractPoints = (snapshotRewards: any) => {
	return {
		rewards: snapshotRewards[0]?.rewards ?? 0,
		odyssee: snapshotRewards[0]?.odyssee ?? 0,
	};
};

export const getHabitPoints = (habit: Habit) => {
	return {
		odyssee: Math.round(habit.reward * habit.difficulty),
		rewards: habit.difficulty,
	};
};
