import { DayOfWeek } from "@type/days";
import { GenericLevel } from "@type/levels";
import { DailyLog } from "@type/log";
import { UserHabit } from "@type/userHabit";
import dayjs from "dayjs";
import { HabitType } from "./category.type";

/**
 * Function to calculate the streak of the user
 * @param logs
 * @returns
 */
export const calculateStreak = (logs: DailyLog[]): number => {
	const today = dayjs().format("YYYY-MM-DD");
	let maxStreak = 0;
	if (logs.length === 0) {
		return 0;
	}

	const sortedLogs = logs.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
	let currentStreak = 0;
	let expectedDate = dayjs(today);

	for (const log of sortedLogs) {
		const logDate = dayjs(log.date).format("YYYY-MM-DD");
		if (logDate === expectedDate.format("YYYY-MM-DD")) {
			currentStreak++;
			expectedDate = expectedDate.subtract(1, "day");
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

	const today = dayjs().format("YYYY-MM-DD");
	const sevenDaysAgo = dayjs().subtract(7, "day").format("YYYY-MM-DD");
	let maxStreak = 0;

	const sortedLogs = logs.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
	let currentStreak = 0;
	let expectedDate = dayjs(today);

	for (const log of sortedLogs) {
		const logDate = dayjs(log.date).format("YYYY-MM-DD");
		if (logDate >= sevenDaysAgo && logDate <= today) {
			if (logDate === expectedDate.format("YYYY-MM-DD")) {
				currentStreak++;
				expectedDate = expectedDate.subtract(1, "day");
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
			habit.type !== HabitType.negative
	);
	const positivesToday = completedHabitsToday.filter(
		(habit) => habit.type !== HabitType.negative
	);
	return Math.round((positivesToday.length / todayHabits.length) * 100);
};