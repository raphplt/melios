import BottomSlideModal from "@components/Modals/ModalBottom";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import useCompletedHabitPeriods from "@hooks/useCompletedHabitPeriods";
import { CategoryTypeSelect } from "@utils/category.type";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import * as Progress from "react-native-progress";

type Props = {
	showModalDay: boolean;
	setShowModalDay: (value: boolean) => void;
	selectedDay: string;
};

const CalendarDetail = ({
	showModalDay,
	setShowModalDay,
	selectedDay,
}: Props) => {
	const { theme } = useTheme();
	const { habits } = useData();
	const { t } = useTranslation();
	const { logsByDate, loading } = useCompletedHabitPeriods();

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	const completedHabits = habits.filter((habit) => {
		const hasLog = logsByDate[selectedDay]?.some(
			(log) => log.habitId === habit.id
		);
		return habit.type === CategoryTypeSelect.negative ? !hasLog : hasLog;
	});

	const notCompletedHabits = habits.filter((habit) => {
		const hasLog = logsByDate[selectedDay]?.some(
			(log) => log.habitId === habit.id
		);
		return habit.type === CategoryTypeSelect.negative ? hasLog : !hasLog;
	});

	const completionPercentage = (
		habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0
	).toFixed(0);

	return (
		<BottomSlideModal visible={showModalDay} setVisible={setShowModalDay}>
			<View>
				<Text
					className="text-center text-xl font-bold"
					style={{ color: theme.colors.text }}
				>
					{t("completions_for_the")} {selectedDay}
				</Text>
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
				<View className="mb-2">
					<Text style={{ fontWeight: "bold", marginBottom: 10 }}>
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
								<Text
									style={{
										color: theme.colors.text,
									}}
								>
									{habit.name}
								</Text>
							</View>
							<Iconify
								icon="mdi:check-circle"
								color={theme.colors.primary}
								size={18}
							/>
						</View>
					))}

					<Text style={{ fontWeight: "bold", marginVertical: 10 }}>
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
								<Text
									style={{
										color: theme.colors.text,
									}}
								>
									{habit.name}
								</Text>
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
