import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useMemo, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { ActivityIndicator, View, Text } from "react-native";
import SectionHeader from "./SectionHeader";
import React from "react";
import { useTranslation } from "react-i18next";
import BottomSlideModal from "@components/Modals/ModalBottom";
import { useData } from "@context/DataContext";
import { Iconify } from "react-native-iconify";
import CalendarDetail from "./CalendarDetail";

type CalendarDate = {
	dateString: string;
	day: number;
	month: number;
	timestamp: number;
	year: number;
};

const CalendarHabits = () => {
	const { completedHabitPeriods, logsByDate, loading } =
		useCompletedHabitPeriods();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const [showModalDay, setShowModalDay] = useState(false);
	const [showCalendar, setShowCalendar] = useState(true);
	const [selectedDay, setSelectedDay] = useState("");

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
				<View
					className="w-[95%] mx-auto rounded-xl my-2"
					style={{
						borderColor: theme.colors.border,
						borderWidth: 2,
					}}
				>
					<Calendar
						key={calendarKey}
						markingType={"period"}
						markedDates={completedHabitPeriods}
						theme={colors}
						style={[{ borderRadius: 10 }]}
						onDayPress={({ dateString }: CalendarDate) => {
							setSelectedDay(dateString);
							setShowModalDay(true);
						}}
					/>
				</View>
			</SectionHeader>
			<CalendarDetail
				showModalDay={showModalDay}
				setShowModalDay={setShowModalDay}
				selectedDay={selectedDay}
			/>
		</>
	);
};

export default CalendarHabits;
