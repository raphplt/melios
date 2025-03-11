import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { getCurrentMonthHabitLogs } from "@db/logs";
import { Log } from "@type/log";
import { getGlobalLevel, getLevelName } from "@utils/levels";
import { maj } from "@utils/textUtils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MonthlyRecap = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { usersLevels, habits } = useData();

	const [metrics, setMetrics] = useState({
		completionRate: 0,
		maxStreak: 0,
		totalCompletions: 0,
		daysInMonth: 31,
	});

	const globalLevel = getGlobalLevel(usersLevels);

	const calculateMetrics = (logs: Log[]) => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

		// Flatten and filter logs for current month
		const monthDailyLogs = logs.flatMap((log) =>
			(log.logs || [])
				.filter((dailyLog) => {
					const logDate = new Date(dailyLog.date);
					return (
						logDate.getMonth() === currentMonth &&
						logDate.getFullYear() === currentYear
					);
				})
				.map((dailyLog) => ({
					date: new Date(dailyLog.date),
					habitId: log.habitId,
				}))
		);

		// Group by date
		const logsByDate = monthDailyLogs.reduce((acc, log) => {
			const dateStr = log.date.toISOString().split("T")[0];
			if (!acc[dateStr]) acc[dateStr] = new Set();
			acc[dateStr].add(log.habitId);
			return acc;
		}, {} as Record<string, Set<string>>);

		// Calculate completion rate
		const totalHabits = habits.length;
		const dailyCompletions = Object.values(logsByDate).map((set) => set.size);
		const totalCompletions = dailyCompletions.reduce(
			(sum, count) => sum + count,
			0
		);
		const maxPossibleCompletions = totalHabits * daysInMonth;
		const completionRate =
			maxPossibleCompletions > 0 ? totalCompletions / maxPossibleCompletions : 0;

		// Calculate streak
		let currentStreak = 0;
		let maxStreak = 0;
		const sortedDates = Object.keys(logsByDate).sort();

		sortedDates.forEach((dateStr, index) => {
			if (index === 0) {
				currentStreak = 1;
			} else {
				const currentDate = new Date(dateStr);
				const previousDate = new Date(sortedDates[index - 1]);
				const dayDiff =
					(currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

				if (dayDiff === 1) {
					currentStreak++;
				} else {
					currentStreak = 1;
				}
			}
			maxStreak = Math.max(maxStreak, currentStreak);
		});

		return {
			completionRate,
			maxStreak,
			totalCompletions,
			daysInMonth,
		};
	};

	useEffect(() => {
		const fetchMonthLogs = async () => {
			const logs = await getCurrentMonthHabitLogs();
			setMetrics(calculateMetrics(logs));
		};
		fetchMonthLogs();
	}, [habits]);

	type StatItemProps = {
		icon: string;
		label: string;
		value: string;
		color: string;
	};

	const StatItem = ({ icon, label, value, color }: StatItemProps) => (
		<View className="flex-row items-center space-x-4 mb-4 w-full">
			<View
				className="w-10 h-10 rounded-full items-center justify-center"
				style={{ backgroundColor: color + "20" }}
			>
				<Icon name={icon} size={24} color={color} />
			</View>
			<View className="flex-1 ml-3">
				<Text className="text-sm" style={{ color: theme.colors.textTertiary }}>
					{label}
				</Text>
				<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
					{value}
				</Text>
			</View>
		</View>
	);

	return (
		<View
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderRadius: 20,
				padding: 24,
				width: "92%",
				shadowColor: theme.colors.border,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 12,
				elevation: 5,
			}}
		>
			<View className="flex-row justify-between items-center mb-6">
				<Text className="text-2xl font-bold" style={{ color: theme.colors.text }}>
					{t("monthly_recap")}
				</Text>
				<Text
					className="text-base font-medium"
					style={{ color: theme.colors.primary }}
				>
					{maj(new Date().toLocaleString("default", { month: "long" }))}{" "}
					{new Date().getFullYear()}
				</Text>
			</View>

			{/* Progress Circle */}
			<View className="items-center mb-6">
				<Progress.Circle
					size={120}
					progress={metrics.completionRate}
					thickness={12}
					color={theme.colors.primary}
					unfilledColor={theme.colors.border}
					borderWidth={0}
					showsText
					formatText={() => `${Math.round(metrics.completionRate * 100)}%`}
					textStyle={{
						fontSize: 20,
						fontWeight: "bold",
						color: theme.colors.text,
					}}
				/>
				<Text
					className="mt-2 text-center text-sm"
					style={{ color: theme.colors.textTertiary }}
				>
					{t("completion_rate")}
				</Text>
			</View>

			{/* Stats Grid */}
			<View className="mt-4">
				<StatItem
					icon="calendar-check"
					label={t("completed_habits")}
					value={`${metrics.totalCompletions}/${metrics.daysInMonth}`}
					color={theme.colors.redPrimary}
				/>
				<StatItem
					icon="fire"
					label={t("max_streak")}
					value={`${metrics.maxStreak} ${t("days")}`}
					color={theme.colors.bluePrimary}
				/>
				<StatItem
					icon="trophy"
					label={t("current_level")}
					value={`${getLevelName(globalLevel.currentLevel)} - ${t("level")} ${
						globalLevel.currentLevel
					}`}
					color={theme.colors.greenPrimary}
				/>
			</View>

			{/* Streak Progress */}
			<View className="mt-4">
				<Text className="text-sm mb-2" style={{ color: theme.colors.textTertiary }}>
					{t("streak_progress")}
				</Text>
				<Progress.Bar
					progress={metrics.maxStreak / metrics.daysInMonth}
					width={null}
					height={8}
					color={theme.colors.redPrimary}
					unfilledColor={theme.colors.border}
					borderWidth={0}
					borderRadius={4}
				/>
			</View>
		</View>
	);
};

export default MonthlyRecap;
