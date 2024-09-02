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

export default function TimerHabit({
	habit,
	userHabit,
}: {
	habit: Habit;
	userHabit: UserHabit;
}) {
	const [doneToday, setDoneToday] = useState(false);
	const { theme } = useContext(ThemeContext);
	const {
		timerSeconds,
		isTimerActive,
		isTimerVisible,
		startTimer,
		stopTimer,
		date,
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
			{!isTimerActive && !isTimerVisible ? (
				<Pressable
					onPress={() => startTimer(habit.duration, habit)}
					className="py-2 px-6 rounded-lg w-11/12 mx-auto justify-center mt-4 flex flex-row items-center"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<Ionicons name="play" size={24} color={theme.colors.textSecondary} />
					<Text
						className="text-lg text-center font-semibold ml-2"
						style={{ color: theme.colors.textSecondary }}
					>
						Commencer l'habitude
					</Text>
				</Pressable>
			) : (
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