import { ThemeContext } from "@context/ThemeContext";
import { formatTime } from "@utils/timeUtils";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { useHabits } from "@context/HabitsContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import moment from "moment";

export default function TimerHabit() {
	const { theme } = useContext(ThemeContext);
	const { showHabitDetail, setShowHabitDetail } = useHabits();

	const { pauseTimer, stopTimer } = useHabitTimer();

	const { timerSeconds, isTimerActive } = useTimer();

	if (!showHabitDetail) return null;

	return (
		<View className="flex flex-col items-center justify-center h-full bg-slate-100">
			<Pressable
				onPress={() => setShowHabitDetail(false)}
				className="absolute top-0 right-0 p-4 z-10"
			>
				<Iconify
					icon="material-symbols:close"
					size={24}
					color={theme.colors.text}
				/>
			</Pressable>
			<Text
				className="text-7xl font-bold text-center "
				style={{ color: theme.colors.text }}
			>
				{formatTime(timerSeconds)}
			</Text>
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
		</View>
	);
}
