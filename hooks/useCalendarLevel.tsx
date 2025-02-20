import { useMemo, useState, useEffect } from "react";
import moment from "moment";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { Log, DailyLog } from "@type/log";

const useCompletedHabitPeriods = () => {
	const { logs } = useData();
	const { theme } = useTheme();
	const [loading, setLoading] = useState(true);

	const bgColor = theme.colors.primary;

	const completedHabitPeriods = useMemo(() => {
		if (!logs || logs.length === 0) {
			return { periods: {}, logsByDate: {} };
		}

		const completedDates = new Set<string>();
		const logsByDate: Record<string, DailyLog[]> = {};

		// On parcourt tous les logs et sous-logs
		logs.forEach((logEntry: Log) => {
			logEntry.logs?.forEach((dailyLog: DailyLog) => {
				if (!dailyLog.date) return;

				const logDate = moment(dailyLog.date).format("YYYY-MM-DD");

				completedDates.add(logDate);

				if (!logsByDate[logDate]) {
					logsByDate[logDate] = [];
				}
				logsByDate[logDate].push(dailyLog);
			});
		});

		// On trie toutes les dates complétées
		const sortedDates = Array.from(completedDates).sort();

		// Construction des périodes pour le calendrier
		const periods: Record<string, any> = {};
		if (sortedDates.length === 0) {
			return { periods, logsByDate };
		}

		let start = sortedDates[0];
		let end = start;

		sortedDates.forEach((currentDate, index) => {
			if (index === 0) return;

			const previousDate = moment(sortedDates[index - 1]);
			if (moment(currentDate).diff(previousDate, "days") === 1) {
				end = currentDate;
			} else {
				addPeriod(start, end, periods, bgColor);
				start = currentDate;
				end = start;
			}
		});

		// Dernière période
		addPeriod(start, end, periods, bgColor);

		// Mise en surbrillance du jour en cours
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

		// On marque toutes les dates intermédiaires
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
