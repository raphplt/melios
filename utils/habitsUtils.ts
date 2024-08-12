import { Difficulty } from "../types/difficultiesList";

export const processHabits = (snapshotHabits: any, date: string) => {
	const uncompleted = snapshotHabits
		.filter((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date !== date) {
					return true;
				}
				if (lastLog && lastLog.date === date && lastLog.done === false) {
					return true;
				} else if (habit.logs.length === 0) {
					return true;
				}
			}
		})
		.sort((a: any, b: any) => a.moment - b.moment);

	const completed = snapshotHabits
		.filter((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					return true;
				}
			}
		})
		.sort((a: any, b: any) => a.moment - b.moment);

	return { uncompleted, completed };
};

export const difficulties: Difficulty[] = [
	{ 1: "#E9C46A" },
	{ 2: "#F4A261" },
	{ 3: "#F4A261" },
	{ 4: "#E76F51" },
	{ 5: "#E63946" },
];
