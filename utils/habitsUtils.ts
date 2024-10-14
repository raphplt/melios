import { Log } from "@type/log";
import { UserHabit } from "@type/userHabit";

/**
 * Function to set completed habits for today
 *
 */
export const calculateCompletedHabits = (habits: UserHabit[], logs: Log[]) => {
	const today = new Date().toISOString().split("T")[0];
	const completedHabits = habits.filter((habit) => {
		const habitLogs = logs.find((log) => log.habitId === habit.id);
		if (!habitLogs) return false;
		return habitLogs.logs.includes(today);
	});
	return completedHabits;
};
