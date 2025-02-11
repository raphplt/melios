import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import * as Progress from "react-native-progress";
import BottomSlideModal from "@components/Modals/ModalBottom";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import dayjs from "dayjs";

type Props = {
	showModalDay: boolean;
	setShowModalDay: (value: boolean) => void;
	selectedDay: string;
	setSelectedDay: (value: string) => void;
};

const CalendarDetail = ({
	showModalDay,
	setShowModalDay,
	selectedDay,
	setSelectedDay,
}: Props) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { habits, logs } = useData(); // On récupère aussi les logs parent
	const { logsByDate, loading } = useCompletedHabitPeriods();

	const handlePreviousDay = () => {
		const previousDay = dayjs(selectedDay)
			.subtract(1, "day")
			.format("YYYY-MM-DD");
		setSelectedDay(previousDay);
	};

	const handleNextDay = () => {
		const nextDay = dayjs(selectedDay).add(1, "day").format("YYYY-MM-DD");
		setSelectedDay(nextDay);
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	/**
	 *  Récupération des habitudes complétées le jour "selectedDay"
	 *  en vérifiant pour chaque dailyLog parentLog.habitId === habit.id
	 */
	const completedHabits = habits.filter((habit) =>
		logsByDate[selectedDay]?.some((dailyLog) => {
			// On retrouve le "Log" parent (document de la collection habitsLogs)
			const parentLog = logs.find((l) => l.id === dailyLog.logDocId);
			// On vérifie si c'est l'habidId voulu
			return parentLog?.habitId === habit.id;
		})
	);

	const notCompletedHabits = habits.filter(
		(habit) =>
			!logsByDate[selectedDay]?.some((dailyLog) => {
				const parentLog = logs.find((l) => l.id === dailyLog.logDocId);
				return parentLog?.habitId === habit.id;
			})
	);

	const completionPercentage = (
		habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0
	).toFixed(0);

	return (
		<BottomSlideModal visible={showModalDay} setVisible={setShowModalDay}>
			<View>
				{/* Header + Navigation (jour précédent/suivant) */}
				<View className="flex-row justify-between items-center mt-1">
					<Pressable onPress={handlePreviousDay}>
						<Iconify icon="mdi-chevron-left" size={24} color={theme.colors.primary} />
					</Pressable>
					<Text
						className="text-center text-xl font-bold"
						style={{ color: theme.colors.text }}
					>
						{t("completions_for_the")} {selectedDay}
					</Text>
					<Pressable onPress={handleNextDay}>
						<Iconify
							icon="mdi-chevron-right"
							size={24}
							color={theme.colors.primary}
						/>
					</Pressable>
				</View>

				{/* Pourcentage d'accomplissement */}
				<View className="flex-row justify-center gap-2 items-center my-4">
					<Text className="text-center text-lg" style={{ color: theme.colors.text }}>
						{t("completion")} : {completionPercentage}%
					</Text>
					<Progress.Circle
						progress={Number(completionPercentage) / 100}
						size={25}
						color={theme.colors.primary}
						unfilledColor={theme.colors.border}
						borderWidth={0}
						thickness={4}
					/>
				</View>

				{/* Liste des habitudes complétées / non complétées */}
				<View className="mb-2">
					<Text
						style={{ fontWeight: "bold", marginBottom: 10, color: theme.colors.text }}
					>
						{t("completed_habits")}
					</Text>
					{completedHabits.map((habit) => (
						<View
							key={habit.id}
							className="flex-row justify-between items-center my-2"
						>
							<View className="flex-row items-center gap-2">
								<View className="w-7 h-7 flex items-center justify-center">
									<FontAwesome6
										name={habit.icon}
										size={16}
										color={habit.color ?? theme.colors.primary}
									/>
								</View>
								<Text style={{ color: theme.colors.text }}>{habit.name}</Text>
							</View>
							<Iconify
								icon="mdi:check-circle"
								color={theme.colors.primary}
								size={18}
							/>
						</View>
					))}

					<Text
						style={{
							fontWeight: "bold",
							marginVertical: 10,
							color: theme.colors.text,
						}}
					>
						{t("not_completed_habits")}
					</Text>
					{notCompletedHabits.map((habit) => (
						<View
							key={habit.id}
							className="flex-row justify-between items-center my-2"
						>
							<View className="flex-row items-center gap-2">
								<FontAwesome6
									name={habit.icon}
									size={18}
									color={habit.color ?? theme.colors.primary}
								/>
								<Text style={{ color: theme.colors.text }}>{habit.name}</Text>
							</View>
							<Iconify
								icon="mdi:close-circle"
								color={theme.colors.redPrimary}
								size={18}
							/>
						</View>
					))}
				</View>
			</View>
		</BottomSlideModal>
	);
};

export default CalendarDetail;
