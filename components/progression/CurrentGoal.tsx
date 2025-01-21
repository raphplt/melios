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
import { deleteMemberGoal } from "@db/goal";
import { useGoal } from "@context/GoalsContext";

export default function CurrentGoal({ goal }: { goal: Goal }) {
	const { width } = Dimensions.get("window");
	const { getUserHabitDetails, userHabits } = useIndex();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [userHabit, setUserHabit] = useState<UserHabit>();
	const [goalStreak, setGoalStreak] = useState(0);
	const [isCompletedToday, setIsCompletedToday] = useState(false);
	const [isGoalMissed, setIsGoalMissed] = useState(false);
	const [completedDays, setCompletedDays] = useState<Date[]>([]);
	const { goals, setGoals } = useGoal();

	// State for modal
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		async function getHabitInfos() {
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

	const handleDelete = async () => {
		try {
			await deleteMemberGoal(goal.memberId, goal.id);
			setVisible(false);
			const newGoals = goals.filter((g) => g.id !== goal.id);
			setGoals(newGoals);
		} catch (error) {
			console.error("Erreur lors de la suppression de l'objectif: ", error);
		}
	};

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
				<View className="flex flex-row items-center justify-between py-1">
					{!isGoalMissed ? (
						<View className="flex items-center justify-start flex-row ">
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
					) : (
						<Pressable
							onPress={handleDelete}
							style={{
								backgroundColor: theme.colors.redSecondary,
							}}
							className="p-1 rounded-xl"
						>
							<Iconify icon="mdi:trash" size={24} color={theme.colors.redPrimary} />
						</Pressable>
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
						<MoneyMelios width={20} />
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
