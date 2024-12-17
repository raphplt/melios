import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { useData } from "@context/DataContext";

const useCompletedHabitPeriods = () => {
	const { logs } = useData();
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState(true);

	if (!logs) {
		setLoading(false);
		return { completedHabitPeriods: {}, loading };
	}

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

		const markedDates: Record<string, any> = {};

		completedDates.forEach((date) => {
			markedDates[date] = {
				customStyles: {
					container: {
						backgroundColor: bgColor,
					},
					text: {
						color: "white",
					},
				},
			};
		});

		setLoading(false);
		return markedDates;
	}, [logs, bgColor]);

	return { completedHabitPeriods, loading };
};

export default useCompletedHabitPeriods;
