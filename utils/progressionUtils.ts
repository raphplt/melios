import { DayOfWeek } from "@type/days";
import { GenericLevel } from "@type/levels";
import { DailyLog } from "@type/log";
import { UserHabit } from "@type/userHabit";
import moment from "moment";
import { CategoryTypeSelect } from "./category.type";

/**
 * Function to calculate the streak of the user
 * @param logs
 * @returns
 */
export const calculateStreak = (logs: DailyLog[]): number => {
	const today = moment().format("YYYY-MM-DD");
	let maxStreak = 0;
	if (logs.length === 0) {
		return 0;
	}

	const sortedLogs = logs.sort((a, b) => moment(b.date).diff(moment(a.date)));
	let currentStreak = 0;
	let expectedDate = moment(today);

	for (const log of sortedLogs) {
		const logDate = moment(log.date).format("YYYY-MM-DD");
		if (logDate === expectedDate.format("YYYY-MM-DD")) {
			currentStreak++;
			expectedDate.subtract(1, "days");
		} else {
			break;
		}
		maxStreak = Math.max(maxStreak, currentStreak);
	}

	return maxStreak;
};

/**
 * Function to calculate the weekly streak of the user
 * @param logs
 * @returns
 */
export const calculateWeeklyStreak = (logs: DailyLog[]): number => {
	if (logs.length === 0) {
		return 0;
	}

	const today = moment().format("YYYY-MM-DD");
	const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
	let maxStreak = 0;

	const sortedLogs = logs.sort((a, b) => moment(b.date).diff(moment(a.date)));
	let currentStreak = 0;
	let expectedDate = moment(today);

	for (const log of sortedLogs) {
		const logDate = moment(log.date).format("YYYY-MM-DD");
		if (logDate >= sevenDaysAgo && logDate <= today) {
			if (logDate === expectedDate.format("YYYY-MM-DD")) {
				currentStreak++;
				expectedDate.subtract(1, "days");
			} else {
				break;
			}
		}
		maxStreak = Math.max(maxStreak, currentStreak);
	}

	return maxStreak;
};

/**
 * Function to get level by category id
 */
export const getLevelByCategoryId = (
	idCategory: string,
	genericLevels: GenericLevel[]
) => {
	const idCategoryNumber = Number(idCategory);

	if (isNaN(idCategoryNumber)) {
		console.log("idCategory is not a valid number:", idCategory);
		return undefined;
	}

	const level = genericLevels.find((level) =>
		level.associatedCategoryIds.map(Number).includes(idCategoryNumber)
	);

	if (!level) {
		console.log(
			`No level found for idCategory: ${idCategory}, genericLevels:`,
			genericLevels
		);
	}

	return level;
};

/**
 * Function to get the score of the day
 */
export const getTodayScore = (
	habits: UserHabit[],
	completedHabitsToday: UserHabit[]
): number => {
	if (habits.length === 0) return 0;
	const today: DayOfWeek = new Date()
		.toLocaleString("en-US", { weekday: "long" })
		.toLowerCase() as DayOfWeek;
	const todayHabits = habits.filter(
		(habit) =>
			habit.frequency &&
			habit.frequency[today] &&
			habit.type !== CategoryTypeSelect.negative
	);
	const positivesToday = completedHabitsToday.filter(
		(habit) => habit.type !== CategoryTypeSelect.negative
	);
	return Math.round((positivesToday.length / todayHabits.length) * 100);
};