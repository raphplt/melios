import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import useIndex from "@hooks/useIndex";

export default function HabitsSection() {
	const { userHabits } = useIndex();

	// Obtenir le jour actuel en anglais pour correspondre avec les clés de frequency
	const today = new Date()
		.toLocaleString("en-US", { weekday: "long" })
		.toLowerCase();

	// Filtrer les habitudes par jour et moment
	const morningHabits = userHabits?.filter(
		(habit) => habit.frequency[today] && habit.moment >= 6 && habit.moment < 12
	);

	const afternoonHabits = userHabits?.filter(
		(habit) => habit.frequency[today] && habit.moment >= 12 && habit.moment < 18
	);

	const eveningHabits = userHabits?.filter(
		(habit) => habit.frequency[today] && habit.moment >= 18
	);

	const freeHabits = userHabits?.filter(
		(habit) => habit.frequency[today] && habit.moment === -1
	);

	return (
		<ScrollView style={styles.container}>
			{/* Morning routine */}
			{morningHabits && morningHabits.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.heading}>Morning Routine</Text>
					{morningHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</View>
			)}

			{/* Afternoon routine */}
			{afternoonHabits && afternoonHabits.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.heading}>Afternoon Routine</Text>
					{afternoonHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</View>
			)}

			{/* Evening routine */}
			{eveningHabits && eveningHabits.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.heading}>Evening Routine</Text>
					{eveningHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</View>
			)}

			{/* Free habits */}
			{freeHabits && freeHabits.length > 0 && (
				<View style={styles.section}>
					<Text style={styles.heading}>Libre</Text>
					{freeHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f8f9fa",
	},
	section: {
		marginBottom: 24,
	},
	heading: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 12,
	},
});
