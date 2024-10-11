import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import { Ionicons } from "@expo/vector-icons";

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
			<Pressable
				className="flex flex-row w-11/12 rounded-xl px-2 py-2 mx-auto items-center justify-between"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				onPress={() => setShowCalendar(!showCalendar)}
			>
				<View className="flex flex-row items-center">
					<Iconify icon="mdi-calendar" size={22} color={theme.colors.primary} />
					<Text
						className="text-[16px] mx-2 font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						Jours effectués
					</Text>
				</View>

				<Ionicons
					name={showCalendar ? "chevron-up" : "chevron-down"}
					size={24}
					color={theme.colors.primary}
				/>
			</Pressable>
			{showCalendar && (
				<Calendar
					key={calendarKey}
					markingType={"period"}
					markedDates={completedHabitPeriods}
					theme={colors}
				/>
			)}
		</>
	);
};

export default CalendarHabits;
