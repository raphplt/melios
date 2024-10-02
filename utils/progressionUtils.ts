import { Log } from "@type/log";
import moment from "moment";

export const calculateStreak = (
	allLogs: { habitId: string; logs: Log[] }[]
): number => {
	if (allLogs.length === 0 || !allLogs) return 0;

	let streakCount = 0;
	let streakActive = true;

	const today = moment().format("YYYY-MM-DD");
	let todayCompleted = false;

	for (const habit of allLogs) {
		console.log("habit", habit);

		const logForToday =
			habit &&
			habit.logs.find((log) => {
				const logDate = moment(log.date).format("YYYY-MM-DD");
				return logDate === today;
			});
		if (logForToday) {
			todayCompleted = true;
			break;
		}
	}

	if (todayCompleted) {
		streakCount += 1;
	}

	let daysBack = 1;

	// Boucle pour vérifier les jours précédents
	while (streakActive) {
		const date = moment().subtract(daysBack, "days").format("YYYY-MM-DD");
		let dayCompleted = false;

		// Vérifier les logs pour ce jour particulier
		for (const habit of allLogs) {
			console.log(habit);
			const logForDay =
				habit &&
				habit.logs.find((log) => {
					const logDate = moment(log.date).format("YYYY-MM-DD");
					return logDate === date;
				});
			if (logForDay) {
				dayCompleted = true;
				break;
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
