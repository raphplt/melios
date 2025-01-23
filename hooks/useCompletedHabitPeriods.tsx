import { useContext, useMemo, useState, useEffect } from "react";
import moment from "moment";
import { ThemeContext } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { Log, DailyLog } from "@type/log";

const useCompletedHabitPeriods = () => {
	const { logs } = useData();
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState(true);

	const bgColor = theme.colors.primary;

	const completedHabitPeriods = useMemo(() => {
		if (!logs || logs.length === 0) {
			return { periods: {}, logsByDate: {} };
		}

		const completedDates = new Set<string>();
		const logsByDate: Record<string, DailyLog[]> = {};

		logs.forEach((logEntry: Log) => {
			logEntry.logs?.forEach((dailyLog: DailyLog) => {
				let logDate: string;

				if (dailyLog.date instanceof Date) {
					logDate = moment(dailyLog.date).format("YYYY-MM-DD");
				} else {
					logDate = moment(dailyLog.date).format("YYYY-MM-DD");
				}

				completedDates.add(logDate);
				if (!logsByDate[logDate]) {
					logsByDate[logDate] = [];
				}
				logsByDate[logDate].push(dailyLog);
			});
		});

		const sortedDates = Array.from(completedDates).sort();

		const periods: Record<string, any> = {};
		let start = sortedDates[0];
		let end = start;

		sortedDates.forEach((currentDate, index) => {
			if (index === 0) return;

			const previousDate = moment(sortedDates[index - 1]);
			if (moment(currentDate).diff(previousDate, "days") === 1) {
				end = currentDate;
			} else {
				// Ajouter la période précédente
				addPeriod(start, end, periods, bgColor);
				start = currentDate;
				end = start;
			}
		});

		addPeriod(start, end, periods, bgColor);

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

		return { periods, logsByDate };
	}, [logs, theme.dark, bgColor]);

	useEffect(() => {
		if (logs) setLoading(false);
	}, [logs]);

	return {
		completedHabitPeriods: completedHabitPeriods.periods,
		logsByDate: completedHabitPeriods.logsByDate,
		loading,
	};
};

/**
 * Ajoute une période au tableau des périodes
 */
const addPeriod = (
	start: string,
	end: string,
	periods: Record<string, any>,
	bgColor: string
) => {
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
			let day = moment(start).add(1, "days");
			day.isBefore(end);
			day.add(1, "days")
		) {
			periods[day.format("YYYY-MM-DD")] = {
				color: bgColor,
				textColor: "white",
			};
		}
	}
};

export default useCompletedHabitPeriods;
