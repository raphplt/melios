import moment from "moment";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Text, View, FlatList } from "react-native";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import { DayStatus } from "../../app/habitDetail";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useHabits } from "@context/HabitsContext";
import { CategoryTypeSelect } from "@utils/category.type";

const DAYS_TOTAL = 365;
const INITIAL_VISIBLE_DAYS = 30;
const INCREMENT_DAYS = 30;

interface LastDaysProps {
	logs: any[];
	loading: boolean;
}

export default function LastDays({ logs, loading }: LastDaysProps) {
	const { theme } = useTheme();
	const { currentHabit } = useHabits();
	const { t } = useTranslation();
	const [allDays, setAllDays] = useState<DayStatus[]>([]);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [visibleDaysCount, setVisibleDaysCount] = useState(INITIAL_VISIBLE_DAYS);

	if (!currentHabit || currentHabit.type === CategoryTypeSelect.negative) {
		return null;
	}

	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
	const textColor = theme.dark ? theme.colors.textSecondary : theme.colors.text;

	useEffect(() => {
		if (!loading) {
			// Création d'un Set pour un accès rapide aux dates de log
			const loggedDates = new Set(
				logs.map((log) =>
					moment(log.date?.toDate ? log.date.toDate() : log.date).format(
						"YYYY-MM-DD"
					)
				)
			);

			const daysArray: DayStatus[] = [];
			// On itère de 0 (aujourd'hui) à DAYS_TOTAL
			for (let i = 0; i <= DAYS_TOTAL; i++) {
				const day = moment().subtract(i, "days").format("YYYY-MM-DD");
				daysArray.push({
					date: day,
					done: loggedDates.has(day),
				});
			}

			setAllDays(daysArray);

			// Calcul du streak à partir d'aujourd'hui
			let streak = 0;
			for (let day of daysArray) {
				if (day.done) {
					streak++;
				} else {
					break;
				}
			}
			setCurrentStreak(streak);
		}
	}, [logs, loading]);

	const renderItem = useCallback(
		({ item }: { item: DayStatus }) => (
			<View
				style={{
					backgroundColor: item.done
						? theme.colors.backgroundTertiary
						: theme.colors.backgroundSecondary,
					paddingHorizontal: 12,
					paddingVertical: 8,
					borderRadius: 10,
					margin: 4,
					alignItems: "center",
				}}
			>
				{item.done ? (
					<Iconify size={24} color={theme.colors.text} icon="mdi:check" />
				) : (
					<Iconify size={24} color={theme.colors.text} icon="mdi:close" />
				)}
				<Text style={{ color: theme.colors.text, marginTop: 4, fontWeight: "600" }}>
					{moment(item.date, "YYYY-MM-DD").format("DD/MM")}
				</Text>
			</View>
		),
		[theme.colors]
	);

	const CardPlaceHolder = () => (
		<ShimmerPlaceholder
			width={60}
			height={60}
			style={{ borderRadius: 10, marginHorizontal: 10 }}
		/>
	);

	const placeholders = useMemo(() => Array(5).fill(null), []);

	// Fonction pour charger plus de jours
	const handleLoadMore = () => {
		setVisibleDaysCount((prev) =>
			Math.min(prev + INCREMENT_DAYS, allDays.length)
		);
	};

	return (
		<BlurView
			intensity={100}
			style={{
				padding: 10,
				borderRadius: 12,
				width: "95%",
				alignSelf: "center",
				alignItems: "center",
				overflow: "hidden",
			}}
			tint="extraLight"
		>
			{/* En-tête avec icône et streak */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: "95%",
					paddingTop: 8,
					marginBottom: 8,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Iconify
						icon="ph:calendar-check-fill"
						size={20}
						color={theme.colors.textTertiary}
					/>
					<Text
						style={{
							color: textColor,
							fontSize: 15,
							fontWeight: "600",
							marginLeft: 4,
						}}
					>
						{t("last_days_completion")}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 12,
						paddingVertical: 4,
						borderRadius: 999,
						backgroundColor: theme.colors.backgroundSecondary,
					}}
				>
					<Iconify icon="mdi:fire" size={18} color={theme.colors.redPrimary} />
					<Text
						style={{
							color: theme.colors.text,
							fontSize: 12,
							fontWeight: "600",
							fontStyle: "italic",
							marginLeft: 4,
						}}
					>
						{t("streak")}: {currentStreak}
					</Text>
				</View>
			</View>

			{/* Liste horizontale des jours */}
			{!loading ? (
				<>
					<FlatList
						data={allDays.slice(0, visibleDaysCount)}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
						onEndReached={handleLoadMore}
						keyExtractor={(_, index) => index.toString()}
						renderItem={renderItem}
					/>
				</>
			) : (
				<View
					style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}
				>
					{placeholders.map((_, index) => (
						<CardPlaceHolder key={index} />
					))}
				</View>
			)}
		</BlurView>
	);
}