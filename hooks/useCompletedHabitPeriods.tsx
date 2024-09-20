import { useContext, useMemo } from "react";
import moment from "moment";
import useIndex from "./useIndex";
import { ThemeContext } from "@context/ThemeContext";

const useCompletedHabitPeriods = () => {
	const { userHabits: habits } = useIndex();
	const { theme } = useContext(ThemeContext);

	const bgColor = theme.colors.primary;

	return useMemo(() => {
		if (habits.length === 0) return {};

		const completedDates = new Set<string>();

		// Collect all dates where at least one habit was completed
		habits.forEach((habit) => {
			habit.logs?.forEach((log) => {
				if (log.done) {
					completedDates.add(log.date);
				}
			});
		});

		const sortedDates = Array.from(completedDates).sort();
		const periods: Record<string, any> = {};

let start = sortedDates[0];
let end = start;

for (let i = 1; i < sortedDates.length; i++) {
	const currentDate = sortedDates[i];
	const previousDate = moment(sortedDates[i - 1]);

	if (moment(currentDate).diff(previousDate, "days") === 1) {
		end = currentDate;
	} else {
		if (start === end) {
			periods[start] = {
				startingDay: true,
				endingDay: true,
				color: bgColor,
				textColor: "white",
			};
		} else {
			periods[start] = {
				startingDay: true,
				color: bgColor,
				textColor: "white",
			};
			periods[end] = { endingDay: true, color: bgColor, textColor: "white" };

			for (
				let j = moment(start).add(1, "days");
				j.isBefore(end);
				j.add(1, "days")
			) {
				periods[j.format("YYYY-MM-DD")] = { color: bgColor, textColor: "white" };
			}
		}

		start = currentDate;
		end = start;
	}
}

// Handle the last period
if (start === end) {
	periods[start] = {
		startingDay: true,
		endingDay: true,
		color: bgColor,
		textColor: "white",
	};
} else {
	periods[start] = { startingDay: true, color: bgColor, textColor: "white" };
	periods[end] = { endingDay: true, color: bgColor, textColor: "white" };

	for (let j = moment(start).add(1, "days"); j.isBefore(end); j.add(1, "days")) {
		periods[j.format("YYYY-MM-DD")] = { color: bgColor, textColor: "white" };
	}
}

return periods;
	}, [habits]);
};

export default useCompletedHabitPeriods;
