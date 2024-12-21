import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { Goal } from "@type/goal";
import { Habit } from "@type/habit";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { Iconify } from "react-native-iconify";
import ModalCurrentGoal from "./ModalCurrentGoal";
import * as Progress from "react-native-progress";
import { calcReward } from "@utils/goal";
import MoneyMelios from "@components/Svg/MoneyMelios";

export default function CurrentGoal({ goal }: { goal: Goal }) {
	const { theme } = useTheme();
	const { width } = Dimensions.get("window");
	const { getHabitDetails, getUserHabitDetails, userHabits } = useIndex();
	const [habit, setHabit] = useState<Habit>();
	const [userHabit, setUserHabit] = useState<UserHabit>();
	const [goalStreak, setGoalStreak] = useState(0);
	const [isCompletedToday, setIsCompletedToday] = useState(false);
	const [isGoalMissed, setIsGoalMissed] = useState(false);
	const [completedDays, setCompletedDays] = useState<Date[]>([]);

	// State for modal
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		async function getHabitInfos() {
			const habit = getHabitDetails(goal.habitId);
			setHabit(habit);
			const userHabit = getUserHabitDetails(goal.habitId);
			setUserHabit(userHabit);
		}
		getHabitInfos();
	}, [userHabits]);

	useEffect(() => {
		if (userHabit && goal) {
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
					userHabit &&
					userHabit.logs &&
					userHabit.logs.find(
						(log) => new Date(log.date).toDateString() === currentDate.toDateString()
					);

				if (log && log.done) {
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
		}
	}, [userHabit, goal]);

	console.log("userHabit", userHabit);
	console.log("habit", habit);

	if (!habit || !userHabit) return null;

	const lightColor = lightenColor(
		habit.category.color || theme.colors.primary,
		0.1
	);

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
		<View
			className="flex-1 my-2"
			style={{
				width: width,
			}}
		>
			<Pressable
				style={{
					width: width * 0.95,
					backgroundColor: lightColor || theme.colors.cardBackground,
					borderColor: habit.category.color || theme.colors.primary,
					// borderWidth: 2,
				}}
				className="mx-auto rounded-2xl flex px-5 py-2"
				onPress={() => setVisible(true)}
			>
				<View className="flex justify-between flex-row">
					<View className="flex flex-row items-center">
						<FontAwesome6
							name={habit.category.icon || "question"}
							size={18}
							color={habit.category.color || theme.colors.text}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[15px] font-semibold ml-2 "
						>
							{habit?.name}
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
								Objectif manqué
							</Text>
						</View>
					) : (
						<Progress.Circle
							size={24}
							progress={completionPercentage / 100}
							color={habit.category.color || theme.colors.primary}
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
								Aujourd'hui
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
							{calcReward({ duration: goal.duration, habit: habit }) || 0}
						</Text>
						<MoneyMelios width={22} height={22} />
					</View>
				</View>
			</Pressable>
			<ModalCurrentGoal
				visible={visible}
				setVisible={setVisible}
				goal={goal}
				habit={habit}
				completedDays={completedDays}
			/>
		</View>
	);
}
