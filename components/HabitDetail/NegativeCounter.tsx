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
import { useTranslation } from "react-i18next";

type TimeDifferences = {
	seconds: number;
	minutes: number;
	hours: number;
	days: number;
	months: number;
};

const calculateTimeDifferences = (
	createAt: Timestamp | string | number | Date
): TimeDifferences => {
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

const NegativeCounter: React.FC = () => {
	const { currentHabit } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();

	if (!currentHabit || currentHabit.type !== CategoryTypeSelect.negative) {
		return null;
	}

	const date = currentHabit.resetAt
		? currentHabit.resetAt
		: currentHabit.createAt
		? currentHabit.createAt
		: new Date();

	const [time, setTime] = useState<TimeDifferences>(
		calculateTimeDifferences(date)
	);

	const secondProgress = useSharedValue(time.seconds);
	const minuteProgress = useSharedValue(time.minutes);
	const dayProgress = useSharedValue(time.days);
	const monthProgress = useSharedValue(time.months);

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = calculateTimeDifferences(date);
			setTime(newTime);

			// Update animations
			secondProgress.value = withTiming(newTime.seconds);
			minuteProgress.value = withTiming(newTime.minutes);
			dayProgress.value = withTiming(newTime.days);
			monthProgress.value = withTiming(newTime.months);
		}, 1000);

		return () => clearInterval(interval);
	}, [currentHabit.createAt]);

	const createProgressStyle = (
		progressValue: Animated.SharedValue<number>,
		maxValue: number
	) =>
		useAnimatedStyle(() => ({
			width: `${(progressValue.value / maxValue) * 100}%`,
		}));

	const secondStyle = createProgressStyle(secondProgress, 60);
	const minuteStyle = createProgressStyle(minuteProgress, 60);
	const dayStyle = createProgressStyle(dayProgress, 30);
	const monthStyle = createProgressStyle(monthProgress, 12);

	return (
		<BlurView
			intensity={70}
			className="w-11/12 mx-auto p-4 rounded-xl my-2 overflow-hidden"
			tint="light"
		>
			<View className="p-4">
				<Text
					className="text-xl font-bold mb-4"
					style={{ color: theme.colors.text }}
				>
					{t("congratulations_free")}
				</Text>
				<ProgressBar
					label={t("months")}
					value={time.months}
					style={monthStyle}
					theme={theme}
				/>
				<ProgressBar
					label={t("days")}
					value={time.days}
					style={dayStyle}
					theme={theme}
				/>
				<ProgressBar
					label={t("minutes")}
					value={time.minutes}
					style={minuteStyle}
					theme={theme}
				/>
				<ProgressBar
					label={t("seconds")}
					value={time.seconds}
					style={secondStyle}
					theme={theme}
				/>
			</View>
		</BlurView>
	);
};

type ProgressBarProps = {
	label: string;
	value: number;
	style: ReturnType<typeof useAnimatedStyle>;
	theme: any;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
	label,
	value,
	style,
	theme,
}) => (
	<View className="mb-4">
		<Text className="font-semibold pb-2" style={{ color: theme.colors.text }}>
			{value} {label}
		</Text>
		<View
			className="h-4 rounded-lg border"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Animated.View
				className="h-full rounded-lg"
				style={[style, { backgroundColor: theme.colors.primary }]}
			/>
		</View>
	</View>
);

export default NegativeCounter;