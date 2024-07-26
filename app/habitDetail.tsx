import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Animated, Pressable, AppState } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { lightenColor } from "../utils/Utils";
import { setMemberHabitLog } from "../db/member";
import { setRewards } from "../db/rewards";
import { useData } from "../context/DataContext";
import { formatTime } from "../utils/timeUtils";
import InfosPanel from "../components/HabitDetail/InfosPanel";
import { Habit } from "../types/habit";
import LastDays from "../components/HabitDetail/LastDays";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);
	const date = moment().format("YYYY-MM-DD");

	const translateY = useRef(new Animated.Value(1000)).current;
	const [lastDays, setLastDays] = useState<DayStatus[]>([]);
	const [doneToday, setDoneToday] = useState(false);
	const [validationMessage, setValidationMessage] = useState("");
	const [showValidationMessage, setShowValidationMessage] = useState(false);
	const { setUncompletedHabitsData, setCompletedHabitsData, points, setPoints } =
		useData();
	const [habitParsed, setHabitParsed] = useState<Habit | null>(null);

	const params = useLocalSearchParams();
	let { habit = "", habitInfos = "" } = params;

	useEffect(() => {
		if (typeof habitInfos === "string" && habitInfos) {
			try {
				const snapshot = JSON.parse(habitInfos) as Habit;
				setHabitParsed(snapshot);
			} catch (error) {
				console.error("Failed to parse habitInfos:", error);
			}
		}
	}, [habitInfos]);

	useEffect(() => {
		Animated.spring(translateY, {
			toValue: 0,
			useNativeDriver: true,
		}).start();
	}, []);

	useEffect(() => {
		if (typeof habit === "string" && habit) {
			try {
				const parsedHabit = JSON.parse(habit);
				const last7Days: DayStatus[] = [];
				for (let i = 7; i >= 1; i--) {
					const day = moment().subtract(i, "days").format("YYYY-MM-DD");
					const log = parsedHabit?.logs?.find((log: any) => log.date === day);
					last7Days.push({
						date: day,
						done: log ? log.done : false,
					});
				}
				setLastDays(last7Days);
				const doneToday = parsedHabit?.logs?.find(
					(log: any) => log.date === moment().format("YYYY-MM-DD")
				);
				setDoneToday(doneToday);
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}
	}, [habit]);

	// Timer
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const timerRef = useRef<any>(null);

	const handleTimerEnd = async () => {
		try {
			if (!habitParsed) {
				return;
			}

			setValidationMessage("Félicitations ! Vous avez complété votre habitude.");
			await setMemberHabitLog(habitParsed.id, date, true);
			await setRewards("rewards", habitParsed.reward);
			await setRewards("odyssee", habitParsed.reward + habitParsed.difficulty);
			setPoints({
				...points,
				rewards: points.rewards + habitParsed.reward,
				odyssee: points.odyssee + habitParsed.reward + habitParsed.difficulty,
			});
			setDoneToday(true);
			setCompletedHabitsData(
				(prevHabits: any) => [...prevHabits, habitParsed] as any
			);
			setUncompletedHabitsData((prevHabits: any) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habitParsed.id)
			);
			setShowValidationMessage(true);
			setTimeout(() => setShowValidationMessage(false), 5000);
		} catch (error) {
			console.error("Failed to parse habit:", error);
		}
	};

	const startTimer = () => {
		if (!isTimerActive && habitParsed) {
			const durationSeconds = habitParsed.duration * 60;
			setTimerSeconds(durationSeconds);
			setIsTimerActive(true);
			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current);
						setIsTimerActive(false);
						handleTimerEnd();
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}
	};

	const saveTimerState = async (seconds: number) => {
		try {
			await AsyncStorage.setItem("timerSeconds", seconds.toString());
		} catch (error) {
			console.error("Failed to save timer state:", error);
		}
	};

	const restoreTimerState = async () => {
		try {
			const savedSeconds = await AsyncStorage.getItem("timerSeconds");
			if (savedSeconds !== null) {
				setTimerSeconds(parseInt(savedSeconds, 10));
			}
		} catch (error) {
			console.error("Failed to restore timer state:", error);
		}
	};

	const handleAppStateChange = (nextAppState: any) => {
		if (nextAppState === "background") {
			saveTimerState(timerSeconds);
		} else if (nextAppState === "active") {
			restoreTimerState();
		}
	};

	useEffect(() => {
		const listener = AppState.addEventListener("change", handleAppStateChange);
		restoreTimerState();
		return () => {
			listener.remove();
		};
	}, []);

	useEffect(() => {
		if (isTimerActive) {
			if (!habitParsed) {
				return;
			}

			const durationSeconds = habitParsed.duration * 60;
			setTimerSeconds(durationSeconds);
			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current);
						setIsTimerActive(false);
						handleTimerEnd();
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isTimerActive]);

	const stopTimer = () => {
		clearInterval(timerRef.current);
		setIsTimerActive(false);
	};

	const lightenedColor = lightenColor(
		habitParsed?.category?.color || theme.colors.primary,
		0.1
	);

	if (!habitParsed) {
		return (
			<View
				style={{
					backgroundColor: theme.colors.background,
					paddingTop: 20,
					flex: 1,
				}}
				className="h-screen w-full mx-auto border-gray-500 overflow-y-auto top-0 absolute"
			>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<Animated.View
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: 20,
				flex: 1,
				transform: [{ translateY }],
			}}
			className="h-screen w-full mx-auto border-gray-500 overflow-y-auto top-0 absolute"
		>
			<View className="flex flex-col items-center justify-center mt-4">
				<View
					className="py-2 px-6 rounded-xl w-11/12 mx-auto flex items-center flex-row justify-center"
					style={{
						backgroundColor: lightenedColor,
						borderColor: habitParsed.category?.color,
						borderWidth: 2,
					}}
				>
					<FontAwesome6
						name={habitParsed.category?.icon || "question"}
						size={24}
						color={habitParsed.category?.color || theme.colors.text}
						style={{ marginRight: 10 }}
					/>
					<Text
						style={{
							color: habitParsed.category?.color,
						}}
						className="text-lg text-center font-semibold"
					>
						{habitParsed.name}
					</Text>
				</View>
				{!doneToday ? (
					<View className="py-12">
						{!isTimerActive ? (
							<Pressable
								onPress={startTimer}
								className="py-2 px-6 rounded-xl w-11/12 mx-auto flex flex-row items-center"
								style={{
									backgroundColor: theme.colors.primary,
									borderColor: theme.colors.primary,
									borderWidth: 2,
									marginTop: 10,
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
							<Pressable
								onPress={stopTimer}
								className="py-2 px-6 rounded-xl w-11/12 mx-auto flex flex-row items-center"
								style={{
									backgroundColor: theme.colors.primary,
									borderColor: theme.colors.primary,
									borderWidth: 2,
									marginTop: 10,
								}}
							>
								<Ionicons name="pause" size={24} color={theme.colors.textSecondary} />
								<Text
									className="text-lg text-center font-semibold ml-2"
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
						className="py-3 rounded-xl my-6 w-11/12"
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

				{showValidationMessage && (
					<View
						className="py-3 px-6 rounded-xl w-11/12 mx-auto my-6"
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
							{validationMessage}
						</Text>
					</View>
				)}

				<InfosPanel habitInfos={habitParsed} theme={theme} />

				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] mt-4 text-center w-10/12 mx-auto font-semibold"
				>
					Derniers jours
				</Text>
			<LastDays lastDays={lastDays} theme={theme} habitParsed={habitParsed} />
			</View>
		</Animated.View>
	);
}
