import moment from "moment";
import { Text, View, ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";
import { useState, useEffect } from "react";
import { useTheme } from "@context/ThemeContext";
import { UserHabit } from "@type/userHabit";
import { DayStatus } from "../../app/habitDetail";
import { getHabitLogs } from "@db/logs";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import React from "react";
import { useTranslation } from "react-i18next";
import { CategoryTypeSelect } from "@utils/category.type";

export default function LastDays({ habit }: { habit: UserHabit }) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [lastDays, setLastDays] = useState<DayStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentStreak, setCurrentStreak] = useState(0);

	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

	useEffect(() => {
		const fetchHabitLogs = async () => {
			try {
				const logs = await getHabitLogs(habit.id);
				const lastDaySnapshot: DayStatus[] = [];
				for (let i = 14; i >= 1; i--) {
					const day = moment().subtract(i, "days").format("YYYY-MM-DD");
					let done = logs ? logs.includes(day) : false;
					if (habit.type === CategoryTypeSelect.negative) {
						done = !done;
					}
					lastDaySnapshot.push({
						date: day,
						done,
					});
				}

				setLastDays(lastDaySnapshot.reverse());
				setLoading(false);
				calculateCurrentStreak(lastDaySnapshot);
			} catch (error) {
				console.error("Erreur lors de la récupération des logs :", error);
			}
		};

		fetchHabitLogs();
	}, [habit.id]);

	const calculateCurrentStreak = (days: DayStatus[]) => {
		let streak = 0;
		for (let i = days.length - 2; i >= 0; i--) {
			if (days[i].done) {
				streak++;
			} else {
				break;
			}
		}
		setCurrentStreak(streak);
	};

	const CardPlaceHolder = () => {
		return (
			<ShimmerPlaceholder
				width={60}
				height={60}
				style={{
					borderRadius: 10,
					marginLeft: 10,
					marginRight: 10,
				}}
			/>
		);
	};

	const placeholders = Array(5).fill(null);

	return (
		<>
			<BlurView
				intensity={70}
				className="py-2 px-3 rounded-xl w-11/12 mx-auto flex items-center flex-col justify-center"
				style={{
					overflow: "hidden",
				}}
			>
				<View className="flex flex-row items-center justify-between w-[95%] gap-1 pt-2 pb-1">
					<View className="flex flex-row items-center">
						<Iconify
							icon="ph:calendar-check-fill"
							size={20}
							color={theme.colors.text}
						/>
						<Text
							style={{ color: theme.colors.text }}
							className="text-[15px] font-semibold ml-1"
						>
							{t("last_days_completion")}
						</Text>
					</View>
					<View
						className="flex flex-row items-center justify-start px-3 py-1 "
						style={{
							backgroundColor: theme.colors.backgroundSecondary,
							borderRadius: 10,
						}}
					>
						<Iconify icon="mdi:fire" size={20} color={theme.colors.redPrimary} />
						<Text
							style={{ color: theme.colors.text }}
							className="text-[14px] font-semibold italic "
						>
							{t("streak")}: {currentStreak}
						</Text>
					</View>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
					className="w-full mx-auto mt-2 mb-3"
				>
					{lastDays && !loading ? (
						lastDays.map((day: DayStatus, index) => (
							<View
								key={index}
								style={{
									backgroundColor: day.done
										? theme.colors.greenPrimary
										: theme.colors.backgroundSecondary,
								}}
								className="px-3 py-2 rounded-lg flex flex-col items-center mx-1 my-1"
							>
								{day.done ? (
									<Iconify size={24} color={"#f1F1F1"} icon="mdi:check" />
								) : (
									<Iconify size={24} color={theme.colors.text} icon="mdi:close" />
								)}
								<Text
									style={{ color: day.done ? "#f1F1F1" : theme.colors.text }}
									className="font-semibold mt-1"
								>
									{moment(day.date, "YYYY-MM-DD").format("DD/MM")}
								</Text>
							</View>
						))
					) : (
						<View className="w-full flex flex-row items-center justify-center">
							{placeholders.map((_, index) => (
								<CardPlaceHolder key={index} />
							))}
						</View>
					)}
				</ScrollView>
			</BlurView>
		</>
	);
}