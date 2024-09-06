import { DarkTheme } from "@constants/Theme";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { useData } from "@context/DataContext";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import LoaderScreen from "@components/Shared/LoaderScreen";

const CalendarHabits = () => {
	const completedHabitPeriods = useCompletedHabitPeriods();

	return <Calendar markingType={"period"} markedDates={completedHabitPeriods} />;
};

export default CalendarHabits;
