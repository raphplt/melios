import { UserHabit } from "@type/userHabit";
import moment from "moment";

export const calculateStreak = (habits: UserHabit[]): number => {
	if (habits.length === 0) return 0;

	let streakCount = 0;
	let streakActive = true;

	const today = moment().format("YYYY-MM-DD");
	let todayCompleted = false;

	for (const habit of habits) {
		if (habit.logs) {
			const logForToday = habit.logs.find((log) => log.date === today && log.done);
			if (logForToday) {
				todayCompleted = true;
				break;
			}
		}
	}

	if (todayCompleted) {
		streakCount += 1;
	}

	let daysBack = 1;

	while (streakActive) {
		const date = moment().subtract(daysBack, "days").format("YYYY-MM-DD");
		let dayCompleted = false;

		for (const habit of habits) {
			if (habit.logs) {
				const logForDay = habit.logs.find((log) => log.date === date && log.done);
				if (logForDay) {
					dayCompleted = true;
					break;
				}
			}
		}

		if (dayCompleted) {
			streakCount += 1;
		} else {
			streakActive = false;
		}

		daysBack += 1;
	}

	return streakCount;
};
