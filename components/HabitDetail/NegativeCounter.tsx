import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { CategoryTypeSelect } from "@utils/category.type";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

const calculateTimeDifferences = (createAt: string) => {
	const now = new Date();
	const createdAtDate = new Date(createAt);

	const diffInSeconds = Math.floor(
		(now.getTime() - createdAtDate.getTime()) / 1000
	);

	return {
		seconds: diffInSeconds % 60,
		minutes: Math.floor(diffInSeconds / 60) % 60,
		hours: Math.floor(diffInSeconds / 3600) % 24,
		days: Math.floor(diffInSeconds / (3600 * 24)) % 30,
		months: Math.floor(diffInSeconds / (3600 * 24 * 30)),
	};
};

const NegativeCounter = () => {
	const { currentHabit } = useHabits();
	const { theme } = useTheme();

	if (!currentHabit || currentHabit.type !== CategoryTypeSelect.negative) {
		return null;
	}

	const [time, setTime] = useState(
		calculateTimeDifferences(currentHabit.createAt.toString())
	);

	const secondProgress = useSharedValue(time.seconds);
	const minuteProgress = useSharedValue(time.minutes);
	const dayProgress = useSharedValue(time.days);
	const monthProgress = useSharedValue(time.months);

	console.log("secondProgress", secondProgress);
	console.log("minuteProgress", minuteProgress);
	console.log("dayProgress", dayProgress);
	console.log("monthProgress", monthProgress);

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = calculateTimeDifferences(currentHabit.createAt.toString());
			setTime(newTime);

			// Update animations
			secondProgress.value = withTiming(newTime.seconds);
			minuteProgress.value = withTiming(newTime.minutes);
			dayProgress.value = withTiming(newTime.days);
			monthProgress.value = withTiming(newTime.months);
		}, 1000);

		return () => clearInterval(interval);
	}, [currentHabit.createAt]);

	const secondStyle = useAnimatedStyle(() => ({
		width: `${(secondProgress.value / 60) * 100}%`,
	}));

	const minuteStyle = useAnimatedStyle(() => ({
		width: `${(minuteProgress.value / 60) * 100}%`,
	}));

	const dayStyle = useAnimatedStyle(() => ({
		width: `${(dayProgress.value / 30) * 100}%`,
	}));

	const monthStyle = useAnimatedStyle(() => ({
		width: `${(monthProgress.value / 12) * 100}%`,
	}));

	return (
		<View style={styles.container}>
			<Text style={[styles.label, { color: theme.colors.text }]}>
				Time since creation : {currentHabit.createAt.toString()}
			</Text>

			<View style={styles.barContainer}>
				<Text style={[styles.text, { color: theme.colors.text }]}>
					Seconds: {time.seconds}
				</Text>
				<Animated.View style={[styles.bar, styles.secondBar, secondStyle]} />
			</View>

			<View style={styles.barContainer}>
				<Text style={[styles.text, { color: theme.colors.text }]}>
					Minutes: {time.minutes}
				</Text>
				<Animated.View style={[styles.bar, styles.minuteBar, minuteStyle]} />
			</View>

			<View style={styles.barContainer}>
				<Text style={[styles.text, { color: theme.colors.text }]}>
					Days: {time.days}
				</Text>
				<Animated.View style={[styles.bar, styles.dayBar, dayStyle]} />
			</View>

			<View style={styles.barContainer}>
				<Text style={[styles.text, { color: theme.colors.text }]}>
					Months: {time.months}
				</Text>
				<Animated.View style={[styles.bar, styles.monthBar, monthStyle]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	label: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	barContainer: {
		marginBottom: 16,
	},
	text: {
		marginBottom: 4,
		fontSize: 14,
	},
	bar: {
		height: 10,
		borderRadius: 5,
		backgroundColor: "#ccc",
	},
	secondBar: {
		backgroundColor: "#ff4d4d",
	},
	minuteBar: {
		backgroundColor: "#ff9933",
	},
	dayBar: {
		backgroundColor: "#4caf50",
	},
	monthBar: {
		backgroundColor: "#2196f3",
	},
});

export default NegativeCounter;
