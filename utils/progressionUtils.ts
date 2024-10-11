import { Log } from "@type/log";
import moment from "moment";

/**
 * Function to calculate the streak of the user
 * @param logs 
 * @returns 
 */
export const calculateStreak = (logs: Log[]): number => {
	const today = moment().format("YYYY-MM-DD");
	let maxStreak = 0;

	logs.forEach((log) => {
		const sortedLogs = log.logs.sort((a, b) => moment(b).diff(moment(a)));
		let currentStreak = 0;
		let expectedDate = moment(today);

		for (const logDate of sortedLogs) {
			if (logDate === expectedDate.format("YYYY-MM-DD")) {
				currentStreak++;
				expectedDate.subtract(1, "days");
			} else {
				break;
			}
		}

		maxStreak = Math.max(maxStreak, currentStreak);
	});

	return maxStreak;
};

/**
 * Function to calculate the weekly streak of the user
 * @param logs 
 * @returns 
 */
export const calculateWeeklyStreak = (logs: Log[]): number => {
    const today = moment().format("YYYY-MM-DD");
    const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
    let maxStreak = 0;

	logs.forEach((log) => {
		const sortedLogs = log.logs.sort((a, b) => moment(b).diff(moment(a)));
		let currentStreak = 0;
		let expectedDate = moment(today);

		for (const logDate of sortedLogs) {
			if (logDate >= sevenDaysAgo && logDate <= today) {
				if (logDate === expectedDate.format("YYYY-MM-DD")) {
					currentStreak++;
					expectedDate.subtract(1, "days");
				} else {
					break;
				}
			}
		}

		maxStreak = Math.max(maxStreak, currentStreak);
	});

    return maxStreak;
};