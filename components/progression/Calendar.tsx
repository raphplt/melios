import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useMemo, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { ActivityIndicator, View } from "react-native";
import SectionHeader from "./SectionHeader";
import { useTranslation } from "react-i18next";
import React from "react";
import moment from "moment";

const CalendarHabits = () => {
	const { completedHabitPeriods, loading } = useCompletedHabitPeriods();
	const { theme } = useTheme();
	const { t } = useTranslation();
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

	const currentDate = moment().format("YYYY-MM-DD");

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	const markedDates = { ...completedHabitPeriods };

	markedDates[currentDate] = {
		...(markedDates[currentDate] || {}),
		customStyles: {
			...(markedDates[currentDate]?.customStyles || {}),
			container: {
				...(markedDates[currentDate]?.customStyles?.container || {}),
				borderColor: "red",
				borderWidth: 2,
			},
			text: {
				...(markedDates[currentDate]?.customStyles?.text || {}),
				color: "red",
			},
		},
	};

	return (
		<>
			<SectionHeader
				title={t("days_done")}
				show={showCalendar}
				setShow={setShowCalendar}
				icon="calendar"
			>
				{showCalendar && (
					<Calendar
						key={calendarKey}
						markingType="custom"
						markedDates={markedDates}
						theme={colors}
					/>
				)}
			</SectionHeader>
		</>
	);
};

export default CalendarHabits;
