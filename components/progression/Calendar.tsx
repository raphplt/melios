import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "./SectionHeader";

const CalendarHabits = () => {
	const { completedHabitPeriods, loading } = useCompletedHabitPeriods();
	const { theme } = useContext(ThemeContext);
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
				title="Jours effectués"
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
