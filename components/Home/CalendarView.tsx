import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { UserHabit } from "@type/userHabit";
import CardCheckHabit from "@components/Habit/CardCheckHabit";
import { DayOfWeek } from "@type/days";

type CalendarViewProps = {
	habits: UserHabit[];
};

const CalendarView = ({ habits }: CalendarViewProps) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [markedDates, setMarkedDates] = useState({});

	// Convertir le jour de la semaine d'une date en DayOfWeek
	const getDayOfWeek = (date: Date): DayOfWeek => {
		return date
			.toLocaleString("en-US", { weekday: "long" })
			.toLowerCase() as DayOfWeek;
	};

	// Calculer les dates marquées où des habitudes sont programmées
	useEffect(() => {
		const marks: any = {};
		const currentMonth = selectedDate.getMonth();
		const currentYear = selectedDate.getFullYear();

		// Pour chaque jour du mois
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(currentYear, currentMonth, day);
			const dayOfWeek = getDayOfWeek(date);

			// Vérifier si des habitudes sont programmées ce jour
			const hasHabits = habits.some(
				(habit) => habit.frequency && habit.frequency[dayOfWeek]
			);

			if (hasHabits) {
				const dateString = date.toISOString().split("T")[0];
				marks[dateString] = {
					marked: true,
					dotColor: theme.colors.primary,
				};
			}
		}

		// Marquer le jour sélectionné
		const selectedDateString = selectedDate.toISOString().split("T")[0];
		marks[selectedDateString] = {
			...marks[selectedDateString],
			selected: true,
			selectedColor: theme.colors.primary,
		};

		setMarkedDates(marks);
	}, [habits, selectedDate, theme.colors.primary]);

	// Habitudes pour le jour sélectionné
	const habitsForSelectedDay = useMemo(() => {
		const dayOfWeek = getDayOfWeek(selectedDate);
		return habits.filter(
			(habit) => habit.frequency && habit.frequency[dayOfWeek]
		);
	}, [habits, selectedDate]);

	const onDayPress = (day: DateData) => {
		setSelectedDate(new Date(day.timestamp));
	};

	return (
		<View style={styles.container}>
			<Calendar
				onDayPress={onDayPress}
				markedDates={markedDates}
				theme={{
					calendarBackground: theme.colors.background,
					textSectionTitleColor: theme.colors.textSecondary,
					selectedDayBackgroundColor: theme.colors.primary,
					selectedDayTextColor: "#ffffff",
					todayTextColor: theme.colors.primary,
					dayTextColor: theme.colors.text,
					textDisabledColor: theme.colors.textTertiary,
					monthTextColor: theme.colors.text,
					arrowColor: theme.colors.primary,
				}}
			/>

			<View style={styles.habitsContainer}>
				<Text style={[styles.dateTitle, { color: theme.colors.text }]}>
					{selectedDate.toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</Text>

				{habitsForSelectedDay.length > 0 ? (
					habitsForSelectedDay.map((habit) => (
						<CardCheckHabit key={habit.id || habit.name} habit={habit} />
					))
				) : (
					<Text style={[styles.noHabits, { color: theme.colors.textSecondary }]}>
						{t("no_habits_for_this_day")}
					</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	habitsContainer: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 20,
	},
	dateTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	noHabits: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 16,
	},
});

export default CalendarView;
