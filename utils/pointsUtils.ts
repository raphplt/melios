import { Habit } from "@type/habit";
import { UserLevel } from "@type/levels";
import { Reward } from "@type/reward";
import { UserHabit } from "@type/userHabit";

/**
 * Extracts the points from a snapshot
 * @param snapshotRewards
 * @returns {rewards, odyssee}
 */
export const extractPoints = (snapshotRewards: Reward[]) => {
	return {
		rewards: snapshotRewards[0]?.rewards ?? 0,
		odyssee: snapshotRewards[0]?.odyssee ?? 0,
	};
};

/**
 * Gets the points from a habit
 * @param habit
 * @returns {rewards, odyssee}
 */
export const getHabitPoints = (habit?: UserHabit) => {
	if (!habit) return { odyssee: 0, rewards: 0 };
	return {
		odyssee: Math.round(habit.difficulty * 2),
		rewards: habit.difficulty,
	};
};

/**
 * Calculates the global level of the user
 * @param usersLevels
 * @returns {number}
 */
export const calculateGlobalLevel = (usersLevels: UserLevel[]) => {
	return Object.values(usersLevels).reduce(
		(total, level) => total + level.currentLevel,
		0
	);
};