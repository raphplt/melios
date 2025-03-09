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
				logDate = new Date((log.date as { seconds: number }).seconds * 1000);
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

/**
 * Return positives habits of the day
 */
export const getTodayHabits = (habits: UserHabit[]): UserHabit[] => {
	const today = new Date();
	const dayOfWeek = today
		.toLocaleString("en-US", { weekday: "short" })
		.toLowerCase();
	const daysMap: { [key: string]: keyof NonNullable<UserHabit["frequency"]> } = {
		mon: "monday",
		tue: "tuesday",
		wed: "wednesday",
		thu: "thursday",
		fri: "friday",
		sat: "saturday",
		sun: "sunday",
	};

	return habits.filter((habit) => {
		const todayKey = daysMap[dayOfWeek];
		const isScheduledToday = habit.frequency?.[todayKey];

		return !habit.frequency || isScheduledToday;
	});
};