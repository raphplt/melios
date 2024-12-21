import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useMemo, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { ActivityIndicator, View } from "react-native";
import SectionHeader from "./SectionHeader";
import React from "react";
import { useTranslation } from "react-i18next";

const CalendarHabits = () => {
	const { completedHabitPeriods, loading } = useCompletedHabitPeriods();
	const { t } = useTranslation();
	const { theme } = useTheme();

	const [showCalendar, setShowCalendar] = useState(true);

	const colors = useMemo(() => {
		return theme.dark
			? {
					agendaKnobColor: "#768390",
					calendarBackground: theme.colors.background,
					dayTextColor: "#f1f1f1",
					monthTextColor: "#ffffff",
					arrowColor: theme.colors.primary,
			  }
			: {
					agendaKnobColor: "#f2f2f2",
					calendarBackground: "#ffffff",
					dayTextColor: "#000000",
					monthTextColor: "#000000",
					arrowColor: theme.colors.primary,
			  };
	}, [theme.dark]);

	const calendarKey = useMemo(
		() => (theme.dark ? "dark" : "light"),
		[theme.dark]
	);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<>
			<SectionHeader
				title={t("days_done")}
				show={showCalendar}
				setShow={setShowCalendar}
				icon="calendar"
			>
				<Calendar
					key={calendarKey}
					markingType={"period"}
					markedDates={completedHabitPeriods}
					theme={colors}
				/>
			</SectionHeader>
		</>
	);
};

export default CalendarHabits;
