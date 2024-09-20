import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useContext, useMemo } from "react";
import { ThemeContext } from "@context/ThemeContext";

const CalendarHabits = () => {
	const completedHabitPeriods = useCompletedHabitPeriods();
	const { theme } = useContext(ThemeContext);

	const colors = useMemo(() => {
		return theme.dark
			? {
					agendaKnobColor: "#768390",
					calendarBackground: theme.colors.background,
					dayTextColor: "#f1f1f1",
					monthTextColor: "#ffffff",
			  }
			: {
					agendaKnobColor: "#f2f2f2",
					calendarBackground: "#ffffff",
					dayTextColor: "#000000",
					monthTextColor: "#000000",
			  };
	}, [theme.dark]);

	const calendarKey = useMemo(
		() => (theme.dark ? "dark" : "light"),
		[theme.dark]
	);

	return (
		<Calendar
			key={calendarKey}
			markingType={"period"}
			markedDates={completedHabitPeriods}
			theme={colors}
		/>
	);
};

export default CalendarHabits;
