import { ThemeContext } from "@context/ThemeContext";
import { formatTime, formatRemainingTime } from "@utils/timeUtils";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { useHabits } from "@context/HabitsContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import * as Progress from "react-native-progress";

export default function TimerHabit() {
	const { theme } = useContext(ThemeContext);
	const { showHabitDetail, setShowHabitDetail, currentHabit } = useHabits();

	const { pauseTimer, stopTimer } = useHabitTimer();
	const { timerSeconds, isTimerActive } = useTimer();

	if (showHabitDetail || !currentHabit?.habit) return null;

	const handleQuit = () => {
		setShowHabitDetail(true);
		stopTimer();
	};

	const totalSeconds = currentHabit.habit.duration * 60;
	const remainingTime = formatRemainingTime(timerSeconds, totalSeconds);

	return (
		<View className="flex flex-col items-center justify-evenly h-full">
			<Pressable onPress={handleQuit} className="absolute top-0 right-0 p-4 z-10">
				<Iconify
					icon="material-symbols:close"
					size={24}
					color={theme.colors.text}
				/>
			</Pressable>
			<View className="flex flex-col items-center justify-center">
				<Text
					style={{
						fontFamily: "BaskervilleBold",
					}}
					className="text-xl text-center"
				>
					{currentHabit.habit.name}
				</Text>
				<View className=" w-64 h-64 bg-slate-500 rounded-xl my-10"></View>
			</View>

			<View className="flex flex-col items-center w-full mt-8 mx-auto">
				<View className=" my-3 w-10/12">
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
				<Pressable
					onPress={pauseTimer}
					className="py-2 rounded-full mx-auto flex flex-row items-center justify-center w-16 h-16"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					{isTimerActive ? (
						<Iconify
							icon="material-symbols:pause"
							size={28}
							color={theme.colors.textSecondary}
						/>
					) : (
						<Iconify
							icon="material-symbols:play-arrow"
							size={28}
							color={theme.colors.textSecondary}
						/>
					)}
				</Pressable>
			</View>
		</View>
	);
}
