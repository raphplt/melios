import { useHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import { useTimer } from "@context/TimerContext";
import { formatRemainingTime, formatTime } from "@utils/timeUtils";
import { useContext } from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

export default function ProgressBar() {
	const { theme } = useContext(ThemeContext);
	const { currentHabit } = useHabits();
	const { timerSeconds } = useTimer();

	if (!currentHabit?.habit) return null;

	const totalSeconds = currentHabit.habit.duration * 60;
	const remainingTime = formatRemainingTime(timerSeconds, totalSeconds);

	return (
		<View className="my-3 w-10/12">
			<Progress.Bar
				progress={1 - timerSeconds / totalSeconds}
				className="w-full"
				height={8}
				borderColor="transparent"
				unfilledColor={theme.colors.border}
				color={theme.colors.primary}
				width={null}
				useNativeDriver={true}
				borderWidth={0}
			/>
			<View className="flex items-center flex-row justify-between">
				<Text className="text-center my-2">{remainingTime}</Text>
				<Text className="text-center my-2">
					{formatTime(currentHabit.habit.duration * 60)}
				</Text>
			</View>
		</View>
	);
}
