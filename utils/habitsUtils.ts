import { DailyLog } from "@type/log";
import { UserHabit } from "@type/userHabit";

/**
 * Function to set completed habits for today
 */
export const calculateCompletedHabits = (
	habits: UserHabit[],
	logs: { habitId: string; logs: DailyLog[] }[]
) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const completedHabits = habits.filter((habit) => {
		const habitLogs = logs.find((log) => log.habitId === habit.id)?.logs || [];

		return habitLogs.some((log) => {
			let logDate: Date;

			if (log.date instanceof Date) {
				logDate = log.date;
			} else if (
				typeof log.date === "object" &&
				"seconds" in log.date &&
				"nanoseconds" in log.date
			) {
				logDate = new Date(log.date.seconds * 1000);
			} else if (typeof log.date === "string") {
				logDate = new Date(log.date);
			} else {
				console.warn("Format de date inconnu :", log.date);
				return false;
			}

			logDate.setHours(0, 0, 0, 0);

			return logDate.getTime() === today.getTime();
		});
	});

	return completedHabits;
};
