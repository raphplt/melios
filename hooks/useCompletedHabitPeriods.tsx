import { useContext, useMemo, useState, useEffect } from "react";
import moment from "moment";
import useIndex from "./useIndex";
import { ThemeContext } from "@context/ThemeContext";
import { useData } from "@context/DataContext";

const useCompletedHabitPeriods = () => {
	// const { userHabits: habits } = useIndex();
	const { logs } = useData();
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState(true);

	const bgColor = theme.colors.primary;

	const completedHabitPeriods = useMemo(() => {
		if (logs.length === 0) {
			setLoading(false);
			return {};
		}

		const completedDates = new Set<string>();

		logs.forEach((logEntry) => {
			logEntry.logs.forEach((date) => {
				completedDates.add(date);
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
					periods[end] = {
						endingDay: true,
						color: bgColor,
						textColor: "white",
					};

					for (
						let j = moment(start).add(1, "days");
						j.isBefore(end);
						j.add(1, "days")
					) {
						periods[j.format("YYYY-MM-DD")] = {
							color: bgColor,
							textColor: "white",
						};
					}
				}
				start = currentDate;
				end = start;
			}
		}

		// Gère la dernière période
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
			periods[end] = {
				endingDay: true,
				color: bgColor,
				textColor: "white",
			};

			for (
				let j = moment(start).add(1, "days");
				j.isBefore(end);
				j.add(1, "days")
			) {
				periods[j.format("YYYY-MM-DD")] = {
					color: bgColor,
					textColor: "white",
				};
			}
		}

		const today = moment().format("YYYY-MM-DD");
		const highlightColor = theme.dark ? "#ffcc00" : "#C95355";
		if (periods[today]) {
			periods[today].color = highlightColor;
			periods[today].textColor = "white";
		} else {
			periods[today] = {
				startingDay: true,
				endingDay: true,
				color: highlightColor,
				textColor: "white",
			};
		}

		setLoading(false);
		return periods;
	}, [logs, theme.dark]);

	return { completedHabitPeriods, loading };
};

export default useCompletedHabitPeriods;
