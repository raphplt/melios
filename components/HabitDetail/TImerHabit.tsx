import { ThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useTimer from "@hooks/useTimer";
import { formatTime } from "@utils/timeUtils";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import DoneToday from "./DoneToday";
import { Habit } from "@type/habit";
import { Log, UserHabit } from "@type/userHabit";
import { Iconify } from "react-native-iconify";
import { useHabits } from "@context/HabitsContext";

export default function TimerHabit({
	habit,
	userHabit,
}: {
	habit: Habit;
	userHabit: UserHabit;
}) {
	const { theme } = useContext(ThemeContext);
	const { showHabitDetail } = useHabits();

	const {
		timerSeconds,
		isTimerActive,
		isTimerVisible,

		stopTimer,
		pauseTimer,
	} = useTimer();

	return (
		<View className="py-10">
			{isTimerVisible && (
				<Text
					className="text-7xl font-bold text-center mt-8"
					style={{ color: theme.colors.text }}
				>
					{formatTime(timerSeconds)}
				</Text>
			)}
			{!isTimerActive && (
				<View className="flex flex-row items-center justify-center w-full mt-8 mx-auto">
					<Pressable
						onPress={pauseTimer}
						className="py-2 rounded-xl w-1/3 mx-auto flex flex-row items-center justify-center"
						style={{
							backgroundColor: theme.colors.primary,
						}}
					>
						{isTimerActive ? (
							<Iconify
								icon="material-symbols:pause"
								size={24}
								color={theme.colors.textSecondary}
							/>
						) : (
							<Iconify
								icon="material-symbols:play-arrow"
								size={24}
								color={theme.colors.textSecondary}
							/>
						)}
						<Text
							className="text-lg text-center font-semibold ml-2"
							style={{ color: theme.colors.textSecondary }}
						>
							{isTimerActive ? "Pause" : "Reprendre"}
						</Text>
					</Pressable>
					<Pressable
						onPress={stopTimer}
						className="py-2 rounded-xl w-1/3 mx-auto flex flex-row items-center justify-center"
						style={{
							backgroundColor: theme.colors.primary,
						}}
					>
						<Iconify
							icon="material-symbols:stop"
							size={24}
							color={theme.colors.textSecondary}
						/>
						<Text
							className="text-lg text-center font-semibold ml-2 "
							style={{ color: theme.colors.textSecondary }}
						>
							Stop
						</Text>
					</Pressable>
				</View>
			)}
		</View>
	);
}
