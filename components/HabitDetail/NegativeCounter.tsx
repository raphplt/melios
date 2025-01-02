import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { CategoryTypeSelect } from "@utils/category.type";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { BlurView } from "expo-blur";

const calculateTimeDifferences = (
	createAt: Timestamp | string | number | Date
) => {
	const now = new Date();
	let createdAtDate;

	if (createAt instanceof Timestamp) {
		createdAtDate = createAt.toDate();
	} else if (typeof createAt === "string" || typeof createAt === "number") {
		createdAtDate = new Date(createAt);
	} else {
		createdAtDate = new Date();
	}

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
		calculateTimeDifferences(currentHabit.createAt)
	);

	const secondProgress = useSharedValue(time.seconds);
	const minuteProgress = useSharedValue(time.minutes);
	const dayProgress = useSharedValue(time.days);
	const monthProgress = useSharedValue(time.months);

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = calculateTimeDifferences(currentHabit.createAt);
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
		<BlurView
			intensity={70}
			className="w-11/12 mx-auto p-4 rounded-xl my-4 overflow-hidden"
		>
			<View className="p-4">
				<Text
					className="text-xl font-bold mb-4"
					style={{ color: theme.colors.text }}
				>
					Bravo! You have been free for:
				</Text>
				<View className="mb-4">
					<Text
						className="text-sm mb-1"
						style={{
							color: theme.colors.text,
						}}
					>
						Months: {time.months}
					</Text>
					<Animated.View
						className="h-4 rounded-full bg-blue-500"
						style={monthStyle}
					/>
				</View>
				<View className="mb-4">
					<Text className="text-sm mb-1" style={{ color: theme.colors.text }}>
						Days: {time.days}
					</Text>
					<Animated.View
						className="h-4 rounded-full bg-green-500"
						style={dayStyle}
					/>
				</View>
				<View className="mb-4">
					<Text className="text-sm mb-1" style={{ color: theme.colors.text }}>
						Minutes: {time.minutes}
					</Text>
					<Animated.View
						className="h-4 rounded-full bg-orange-500"
						style={minuteStyle}
					/>
				</View>

				<View className="mb-4">
					<Text className="text-sm mb-1" style={{ color: theme.colors.text }}>
						Seconds: {time.seconds}
					</Text>
					<Animated.View
						className="h-4 rounded-full bg-red-500"
						style={secondStyle}
					/>
				</View>
			</View>
		</BlurView>
	);
};

export default NegativeCounter;