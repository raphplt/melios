import { Log } from "@type/log";
import { UserHabit } from "@type/userHabit";

/**
 * Function to set completed habits for today
 *
 */
export const calculateCompletedHabits = (habits: UserHabit[], logs: Log[]) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// console.log("habits", habits);
	// console.log("logs", logs);

	const completedHabits = habits.filter((habit) => {
		const habitLogs = logs.find((log) => log.habitId === habit.id);
		console.log("habitLogs", habitLogs);

		return habitLogs?.logs.some((log) => {
			const logDate = new Date(log.date);
			logDate.setHours(0, 0, 0, 0);
			return logDate.getTime() === today.getTime();
		});
	});
	return completedHabits;
};