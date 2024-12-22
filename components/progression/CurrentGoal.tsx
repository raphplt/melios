import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { Goal } from "@type/goal";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { Iconify } from "react-native-iconify";
import ModalCurrentGoal from "./ModalCurrentGoal";
import * as Progress from "react-native-progress";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { getHabitLogs } from "@db/logs";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";

export default function CurrentGoal({ goal }: { goal: Goal }) {
	const { width } = Dimensions.get("window");
	const { getUserHabitDetails, userHabits } = useIndex();
	const { theme } = useTheme();
	const { habits } = useData();
	const { t } = useTranslation();

	const [userHabit, setUserHabit] = useState<UserHabit>();
	const [goalStreak, setGoalStreak] = useState(0);
	const [isCompletedToday, setIsCompletedToday] = useState(false);
	const [isGoalMissed, setIsGoalMissed] = useState(false);
	const [completedDays, setCompletedDays] = useState<Date[]>([]);

	// State for modal
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		async function getHabitInfos() {
			console.log("goal.habitId", goal.habitId);
			console.log(
				"habits",
				habits.map((h) => h.id)
			);
			const userHabit = getUserHabitDetails(goal.habitId);
			setUserHabit(userHabit);
		}
		getHabitInfos();
	}, [userHabits]);

	useEffect(() => {
		if (userHabit && goal) {
			const fetchLogs = async () => {
				try {
					const logs = await getHabitLogs(goal.habitId);
					const startDate = new Date(goal.createdAt.seconds * 1000);
					let streak = 0;
					let completedToday = false;
					let goalMissed = false;
					let completedDays: Date[] = [];
					const today = new Date();
					today.setHours(0, 0, 0, 0);

					for (let i = 0; i < goal.duration; i++) {
						const currentDate = new Date(startDate);
						currentDate.setDate(startDate.getDate() + i);
						currentDate.setHours(0, 0, 0, 0);

						if (currentDate > today) {
							break;
						}

						const log =
							logs && logs.includes(currentDate.toISOString().split("T")[0]);

						if (log) {
							streak++;
							completedDays.push(currentDate);
							if (currentDate.toDateString() === today.toDateString()) {
								completedToday = true;
							}
						} else {
							if (currentDate.toDateString() !== today.toDateString()) {
								goalMissed = true;
								break;
							}
						}
					}

					setGoalStreak(streak);
					setIsCompletedToday(completedToday);
					setIsGoalMissed(goalMissed);
					setCompletedDays(completedDays);
				} catch (error) {
					console.error("Erreur lors de la récupération des logs :", error);
				}
			};

			fetchLogs();
		}
	}, [userHabit, goal]);

	if (!userHabit) {
		// console.error("Habit not found");
		return null;
	}

	const lightColor = lightenColor(userHabit.color || theme.colors.primary, 0.1);

	const completionPercentage = (goalStreak / goal.duration) * 100;
	let streakColor;
	if (completionPercentage >= 60) {
		streakColor = theme.colors.redPrimary;
	} else if (completionPercentage >= 30) {
		streakColor = theme.colors.orangePrimary;
	} else {
		streakColor = theme.colors.yellowPrimary;
	}

	return (
		<View className="flex-1 my-2" style={{ width: width }}>
			<Pressable
				style={{
					width: width * 0.95,
					backgroundColor: lightColor || theme.colors.cardBackground,
					borderColor: userHabit.color || theme.colors.primary,
				}}
				className="mx-auto rounded-2xl flex px-5 py-2"
				onPress={() => setVisible(true)}
			>
				<View className="flex justify-between flex-row">
					<View className="flex flex-row items-center">
						<FontAwesome6
							name={userHabit.icon || "question"}
							size={18}
							color={userHabit.color || theme.colors.text}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[15px] font-semibold ml-2 "
						>
							{userHabit?.name}
						</Text>
					</View>
					{isGoalMissed ? (
						<View className="flex flex-row items-center">
							<Iconify
								icon="fluent:target-dismiss-20-filled"
								size={20}
								color={theme.colors.redPrimary}
							/>
							<Text
								style={{
									color: theme.colors.redPrimary,
								}}
								className="text-[14px] font-bold ml-1"
							>
								{t("failed_objective")}
							</Text>
						</View>
					) : (
						<Progress.Circle
							size={24}
							progress={completionPercentage / 100}
							color={userHabit.color || theme.colors.primary}
							unfilledColor={theme.colors.border}
							borderWidth={0}
							animated={true}
							indeterminate={false}
							strokeCap="round"
							accessibilityLabel="Progression de l'objectif"
						/>
					)}
				</View>
				<View className="flex flex-row items-center justify-between">
					{!isGoalMissed && (
						<View className="flex items-center justify-start flex-row py-2">
							<Ionicons
								name={isCompletedToday ? "checkmark-circle" : "ellipse-outline"}
								size={20}
								color={
									isCompletedToday
										? theme.colors.greenPrimary
										: theme.colors.textTertiary
								}
							/>
							<Text
								style={{
									color: theme.colors.textTertiary,
								}}
								className=" font-semibold ml-1"
							>
								{t("today")}
							</Text>
						</View>
					)}

					<View className="flex flex-row items-center">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="mx-1 font-semibold text-[16px]"
						>
							{goal.duration - 2 || 0}
						</Text>
						<MoneyMelios width={22} height={22} />
					</View>
				</View>
			</Pressable>
			<ModalCurrentGoal
				visible={visible}
				setVisible={setVisible}
				goal={goal}
				habit={userHabit}
				completedDays={completedDays}
			/>
		</View>
	);
}
