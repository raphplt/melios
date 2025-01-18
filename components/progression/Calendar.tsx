import { Calendar } from "react-native-calendars";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import SectionHeader from "./SectionHeader";
import React from "react";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import CalendarDetail from "./CalendarDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
	const [showTips, setShowTips] = useState(false);

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

	useEffect(() => {
		const fetchShowTips = async () => {
			const value = await AsyncStorage.getItem("showTips");
			if (value === "false") {
				setShowTips(false);
			} else {
				setShowTips(true);
			}
		};
		fetchShowTips();
	}, [logsByDate]);

	const closeTips = async () => {
		setShowTips(false);
		await AsyncStorage.setItem("showTips", "false");
	};

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
				{showTips && (
					<View>
						<View
							style={{
								backgroundColor: theme.colors.cardBackground,
								borderColor: theme.colors.border,
								borderWidth: 1,
							}}
							className="w-[95%] gap-2 mx-auto py-2 px-4 mt-1 rounded-2xl flex flex-row items-center justify-start"
						>
							<Iconify icon="mdi-information" size={24} color={theme.colors.primary} />
							<Text
								style={{
									color: theme.colors.textTertiary,
								}}
								className="text-sm font-normal w-10/12"
							>
								{t("calendar_description")}
							</Text>
							<Pressable onPress={closeTips}>
								<Iconify icon="mdi-close" size={24} color={theme.colors.primary} />
							</Pressable>
						</View>
					</View>
				)}

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
