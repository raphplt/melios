import { ThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useTimer from "@hooks/useTimer";
import { formatTime } from "@utils/timeUtils";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function TimerHabit({
	habit,
	habitParsed,
}: {
	habit: any;
	habitParsed: any;
}) {
	const [doneToday, setDoneToday] = useState(false);
	const [touched, setTouched] = useState(false);
	const { theme } = useContext(ThemeContext);
	const { timerSeconds, isTimerActive, startTimer, stopTimer, date } =
		useTimer();

	useEffect(() => {
		if (typeof habit === "string" && habit) {
			try {
				const parsedHabit = JSON.parse(habit);
				const log = parsedHabit?.logs?.find((log: any) => log.date === date);
				setDoneToday(log ? log.done : false);
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}
	}, [habit]);

	return (
		<>
			{!doneToday ? (
				<View className="py-10">
					{!isTimerActive ? (
						<Pressable
							onPress={() => startTimer(habitParsed.duration, habitParsed)}
							className="py-2 px-6 rounded-lg w-11/12 mx-auto justify-center mt-4 flex flex-row items-center"
							style={{
								backgroundColor: touched
									? theme.colors.bluePrimary
									: theme.colors.primary,
								borderColor: theme.colors.primary,
								borderWidth: 1,
							}}
							onTouchStart={() => setTouched(true)}
							onTouchEndCapture={() => setTouched(false)}
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
						<Pressable
							onPress={stopTimer}
							className="py-2 px-6 rounded-xl w-11/12 mx-auto flex flex-row items-center justify-center"
							style={{
								backgroundColor: theme.colors.primary,
								borderColor: theme.colors.primary,
								borderWidth: 2,
								marginTop: 10,
							}}
						>
							<Ionicons name="pause" size={24} color={theme.colors.textSecondary} />
							<Text
								className="text-lg text-center font-semibold ml-2 "
								style={{ color: theme.colors.textSecondary }}
							>
								Arrêter l'habitude
							</Text>
						</Pressable>
					)}

					{isTimerActive && (
						<Text
							className="text-4xl font-bold text-center mt-8"
							style={{ color: theme.colors.text }}
						>
							{formatTime(timerSeconds)}
						</Text>
					)}
				</View>
			) : (
				<View
					className="py-3 rounded-lg mb-6 mt-10 w-11/12 mx-auto"
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.primary,
						borderWidth: 2,
					}}
				>
					<Ionicons
						name="checkmark-circle"
						size={50}
						color={theme.colors.primary}
						style={{ alignSelf: "center" }}
					/>
					<Text
						className="text-lg text-center font-semibold"
						style={{
							color: theme.colors.primary,
							maxWidth: "90%",
							alignSelf: "center",
						}}
					>
						Vous avez déjà fait cette habitude aujourd'hui
					</Text>
				</View>
			)}
		</>
	);
}
