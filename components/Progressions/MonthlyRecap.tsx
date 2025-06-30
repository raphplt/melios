import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { getCurrentMonthHabitLogs } from "@db/logs";
import { Log } from "@type/log";
import { getGlobalLevel, getLevelName } from "@utils/levels";
import { maj } from "@utils/textUtils";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, ActivityIndicator } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface MonthlyMetrics {
	completionRate: number;
	maxStreak: number;
	totalCompletions: number;
	daysInMonth: number;
	perfectDays: number;
}

const MonthlyRecap = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { usersLevels, habits } = useData();

	const [metrics, setMetrics] = useState<MonthlyMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const globalLevel = getGlobalLevel(usersLevels);

	const calculateMetrics = useCallback(
		(logs: Log[]) => {
			const currentDate = new Date();
			const currentMonth = currentDate.getMonth();
			const currentYear = currentDate.getFullYear();
			const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
			const today = currentDate.getDate();

			// Filtrer les habitudes actives pour ce mois
			const activeHabits = habits.filter((habit) => {
				const habitCreated = new Date(habit.createAt || currentDate);
				return habitCreated <= currentDate;
			});

			if (activeHabits.length === 0) {
				return {
					completionRate: 0,
					maxStreak: 0,
					totalCompletions: 0,
					daysInMonth,
					perfectDays: 0,
				};
			}

			// Grouper par date ET calculer les habitudes complétées par jour
			const dailyCompletions = new Map<string, Set<string>>();

			logs.forEach((log) => {
				log.logs?.forEach((dailyLog) => {
					const logDate = new Date(dailyLog.date);
					if (
						logDate.getMonth() === currentMonth &&
						logDate.getFullYear() === currentYear
					) {
						const dateStr = logDate.toISOString().split("T")[0];
						if (!dailyCompletions.has(dateStr)) {
							dailyCompletions.set(dateStr, new Set());
						}
						dailyCompletions.get(dateStr)!.add(log.habitId);
					}
				});
			});

			// Calculer le taux de completion réel
			let totalPossibleCompletions = 0;
			let totalActualCompletions = 0;
			let perfectDays = 0;

			for (let day = 1; day <= Math.min(today, daysInMonth); day++) {
				const date = new Date(currentYear, currentMonth, day);
				const dateStr = date.toISOString().split("T")[0];

				const habitsActiveOnDay = activeHabits.filter((habit) => {
					const habitCreated = new Date(habit.createAt || currentDate);
					return habitCreated <= date;
				});

				const completedHabitsCount = dailyCompletions.get(dateStr)?.size || 0;

				totalPossibleCompletions += habitsActiveOnDay.length;
				totalActualCompletions += completedHabitsCount;

				// Jour parfait si toutes les habitudes actives sont complétées
				if (
					completedHabitsCount === habitsActiveOnDay.length &&
					habitsActiveOnDay.length > 0
				) {
					perfectDays++;
				}
			}

			const completionRate =
				totalPossibleCompletions > 0
					? totalActualCompletions / totalPossibleCompletions
					: 0;

			// Calculer les streaks de jours parfaits
			let currentStreak = 0;
			let maxStreak = 0;
			let checkDate = new Date(currentYear, currentMonth, 1);

			while (checkDate.getMonth() === currentMonth && checkDate <= currentDate) {
				const dateStr = checkDate.toISOString().split("T")[0];
				const habitsForDay = activeHabits.filter((habit) => {
					const habitCreated = new Date(habit.createAt || currentDate);
					return habitCreated <= checkDate;
				});
				const completedHabits = dailyCompletions.get(dateStr)?.size || 0;

				if (completedHabits === habitsForDay.length && habitsForDay.length > 0) {
					currentStreak++;
					maxStreak = Math.max(maxStreak, currentStreak);
				} else {
					currentStreak = 0;
				}

				checkDate.setDate(checkDate.getDate() + 1);
			}

			return {
				completionRate,
				maxStreak,
				totalCompletions: totalActualCompletions,
				daysInMonth,
				perfectDays,
			};
		},
		[habits]
	);

	useEffect(() => {
		const fetchMonthLogs = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const logs = await getCurrentMonthHabitLogs();
				setMetrics(calculateMetrics(logs));
			} catch (err) {
				setError(err instanceof Error ? err.message : "Une erreur est survenue");
			} finally {
				setIsLoading(false);
			}
		};
		fetchMonthLogs();
	}, [habits, calculateMetrics]);

	type StatItemProps = {
		icon: string;
		label: string;
		value: string;
		color: string;
	};

	const StatItem = ({ icon, label, value, color }: StatItemProps) => (
		<View
			className="flex-row items-center mb-6 w-full"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderRadius: 16,
				padding: 16,
				borderLeftWidth: 4,
				borderLeftColor: color,
				borderWidth: 1,
				borderColor: theme.colors.border,
			}}
			accessible
			accessibilityRole="text"
			accessibilityLabel={`${label}: ${value}`}
		>
			<View
				className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
				style={{
					backgroundColor:
						color === theme.colors.bluePrimary
							? theme.colors.blueSecondary
							: color === theme.colors.redPrimary
							? theme.colors.redSecondary
							: color === theme.colors.yellowPrimary
							? theme.colors.yellowSecondary
							: color === theme.colors.greenPrimary
							? theme.colors.greenSecondary
							: `${color}20`,
					shadowColor: color,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.2,
					shadowRadius: 4,
					elevation: 3,
				}}
				accessible={false}
			>
				<Icon
					name={icon}
					size={26}
					color={theme.dark ? color : theme.colors.text}
				/>
			</View>
			<View className="flex-1">
				<Text
					className="text-sm font-medium mb-1"
					style={{ color: theme.colors.textTertiary }}
					accessibilityRole="text"
				>
					{label}
				</Text>
				<Text
					className="text-xl font-bold"
					style={{ color: theme.colors.text }}
					accessibilityRole="text"
				>
					{value}
				</Text>
			</View>
		</View>
	);

	if (isLoading) {
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
				className="items-center justify-center min-h-[200px]"
				accessible
				accessibilityLabel={
					t("loading_monthly_recap") || "Chargement du récapitulatif mensuel"
				}
			>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={{ color: theme.colors.textTertiary }} className="mt-2">
					{t("loading") || "Chargement..."}
				</Text>
			</View>
		);
	}

	if (error) {
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
				accessible
				accessibilityLabel={t("error_loading_recap") || "Erreur lors du chargement"}
			>
				<Text
					style={{ color: theme.colors.redPrimary || "#FF6B6B" }}
					className="text-center font-semibold mb-2"
				>
					{t("error_occurred") || "Une erreur s'est produite"}
				</Text>
				<Text
					style={{ color: theme.colors.textTertiary }}
					className="text-center text-sm"
				>
					{error}
				</Text>
			</View>
		);
	}

	if (!metrics) return null;

	return (
		<View
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderRadius: 24,
				padding: 28,
				width: "92%",
				shadowColor: "#000000",
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.1,
				shadowRadius: 16,
				elevation: 10,
				borderWidth: 1,
				borderColor: theme.colors.border,
			}}
			accessible
			accessibilityLabel={t("monthly_recap")}
		>
			{/* Header avec gradient effect */}
			<View className="flex-row justify-between items-center mb-8">
				<View>
					<Text
						className="text-3xl font-bold mb-1"
						style={{ color: theme.colors.text }}
					>
						{t("monthly_recap")}
					</Text>
					<View className="flex-row items-center">
						<View
							className="w-2 h-2 rounded-full mr-2"
							style={{ backgroundColor: theme.colors.primary }}
						/>
						<Text
							className="text-base font-medium"
							style={{ color: theme.colors.primary }}
						>
							{maj(new Date().toLocaleString("default", { month: "long" }))}{" "}
							{new Date().getFullYear()}
						</Text>
					</View>
				</View>

				{/* Badge motivationnel */}
				<View
					className="px-4 py-2 rounded-full"
					style={{ backgroundColor: theme.colors.greenSecondary }}
				>
					<Text
						className="text-sm font-bold"
						style={{ color: theme.colors.greenPrimary }}
					>
						🎯 {Math.round(metrics.completionRate * 100)}%
					</Text>
				</View>
			</View>

			{/* Progress Circle amélioré */}
			<View className="items-center mb-8">
				<View className="relative">
					<Progress.Circle
						size={140}
						progress={metrics.completionRate}
						thickness={14}
						color={theme.colors.primary}
						unfilledColor={theme.colors.border}
						borderWidth={0}
						showsText
						formatText={() => `${Math.round(metrics.completionRate * 100)}%`}
						textStyle={{
							fontSize: 24,
							fontWeight: "bold",
							color: theme.colors.text,
						}}
					/>
					{/* Effet de brillance */}
					<View
						className="absolute top-4 left-4 w-6 h-6 rounded-full opacity-30"
						style={{ backgroundColor: theme.colors.background }}
					/>
				</View>
				<Text
					className="mt-4 text-center text-base font-semibold"
					style={{ color: theme.colors.text }}
				>
					{t("completion_rate")}
				</Text>
				<Text
					className="text-center text-sm mt-1"
					style={{ color: theme.colors.textTertiary }}
				>
					{t("monthly_consistency") || "Régularité mensuelle"}
				</Text>
			</View>

			{/* Stats Grid amélioré */}
			<View className="mt-6">
				<StatItem
					icon="check-circle-outline"
					label={t("total_completions")}
					value={`${metrics.totalCompletions}`}
					color={theme.colors.bluePrimary}
				/>
				<StatItem
					icon="fire"
					label={t("max_streak")}
					value={`${metrics.maxStreak} ${t("days")}`}
					color={theme.colors.redPrimary}
				/>
				<StatItem
					icon="star-outline"
					label={t("perfect_days")}
					value={`${metrics.perfectDays}/${Math.min(
						new Date().getDate(),
						metrics.daysInMonth
					)}`}
					color={theme.colors.yellowPrimary || theme.colors.primary}
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

			{/* Perfect Days Progress amélioré */}
			<View
				className="mt-6 p-4 rounded-2xl"
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
					borderWidth: 1,
					borderColor: theme.colors.border,
				}}
			>
				<View className="flex-row items-center justify-between mb-3">
					<Text
						className="text-base font-semibold"
						style={{ color: theme.colors.text }}
					>
						{t("perfect_days_progress")}
					</Text>
					<Text
						className="text-sm font-bold"
						style={{ color: theme.colors.primary }}
					>
						{Math.round(
							(metrics.perfectDays /
								Math.min(new Date().getDate(), metrics.daysInMonth)) *
								100
						)}
						%
					</Text>
				</View>
				<Progress.Bar
					progress={
						metrics.perfectDays / Math.min(new Date().getDate(), metrics.daysInMonth)
					}
					width={null}
					height={12}
					color={theme.colors.primary}
					unfilledColor={theme.colors.border}
					borderWidth={0}
					borderRadius={6}
				/>
				<Text
					className="text-xs text-center mt-3"
					style={{ color: theme.colors.textTertiary }}
				>
					{t("perfect_days_description") ||
						"Jours où toutes vos habitudes ont été complétées"}
				</Text>
			</View>

			{/* Footer motivationnel */}
			<View
				className="mt-6 items-center p-4 rounded-xl"
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<Text
					className="text-center text-base font-semibold"
					style={{ color: theme.colors.text }}
				>
					{metrics.completionRate >= 0.8
						? t("excellent_month") || "🎉 Excellent mois ! Continuez comme ça !"
						: metrics.completionRate >= 0.6
						? t("good_progress") || "💪 Bon progrès ! Vous êtes sur la bonne voie"
						: t("keep_going_monthly") ||
						  "✨ Continuez vos efforts, chaque jour compte !"}
				</Text>
			</View>
		</View>
	);
};

export default MonthlyRecap;
