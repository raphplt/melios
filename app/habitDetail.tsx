import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Animated, Pressable, AppState } from "react-native";
import { ThemeContext } from "../components/ThemeContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { lightenColor } from "../utils/Utils";
import { setMemberHabitLog } from "../db/member";
import { setRewards } from "../db/rewards";
import { useData } from "../constants/DataContext";

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);
	const [difficulty, setDifficulty] = useState("");
	const translateY = useRef(new Animated.Value(1000)).current;
	const [lastDays, setLastDays] = useState([]);
	const [doneToday, setDoneToday] = useState(false);
	const [validationMessage, setValidationMessage] = useState("");
	const [showValidationMessage, setShowValidationMessage] = useState(false);
	const date = moment().format("YYYY-MM-DD");
	const { setUncompletedHabitsData, setCompletedHabitsData, points, setPoints } =
		useData();

	const params = useLocalSearchParams();
	let { habit = "", habitInfos = "" }: any = params;

	if (typeof habitInfos === "string") {
		try {
			habitInfos = JSON.parse(habitInfos);
		} catch (error) {
			console.error("Failed to parse habitInfos:", error);
		}
	}

	useEffect(() => {
		Animated.spring(translateY, {
			toValue: 0,
			useNativeDriver: true,
		}).start();

		if (habitInfos) {
			if (habitInfos.difficulty === 1) {
				setDifficulty("Facile");
			}
			if (habitInfos.difficulty === 2) {
				setDifficulty("Moyen");
			}
			if (habitInfos.difficulty >= 3) {
				setDifficulty("Difficile");
			}
		}
	}, [habitInfos]);

	useEffect(() => {
		if (typeof habit === "string") {
			try {
				habit = JSON.parse(habit);
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}

		const last7Days: any = [];
		for (let i = 7; i >= 1; i--) {
			const day = moment().subtract(i, "days").format("YYYY-MM-DD");
			const log = habit?.logs?.find((log: any) => log.date === day);
			last7Days.push({
				date: day,
				done: log ? log.done : false,
			});
		}
		setLastDays(last7Days);

		const doneToday = habit?.logs?.find(
			(log: any) => log.date === moment().format("YYYY-MM-DD")
		);
		setDoneToday(doneToday);
	}, [habit]);

	// Timer
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const timerRef: any = useRef(null);

	const handleTimerEnd = async () => {
		if (typeof habit === "string") {
			try {
				habit = JSON.parse(habit);
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}
		setValidationMessage("Félicitations ! Vous avez complété votre habitude.");

		await setMemberHabitLog(habit.id, date, true);
		await setRewards("rewards", habitInfos.reward);
		await setRewards("odyssee", habitInfos.reward + habitInfos.difficulty);
		setPoints({
			...points,
			rewards: points.rewards + habitInfos.reward,
			odyssee: points.odyssee + habitInfos.reward + habitInfos.difficulty,
		});

		setDoneToday(true);

		setCompletedHabitsData((prevHabits: any) => [...prevHabits, habit] as any);
		setUncompletedHabitsData((prevHabits: any) =>
			prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
		);

		setShowValidationMessage(true);
		setTimeout(() => setShowValidationMessage(false), 5000);
	};

	const startTimer = () => {
		if (!isTimerActive) {
			const durationSeconds = habitInfos.duration * 60;
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

	const saveTimerState = async (seconds: any) => {
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
			const durationSeconds = habitInfos.duration * 60;
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

	const formatTime = (seconds: any) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

	const lightenedColor = lightenColor(habitInfos.category?.color, 0.1);

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
						borderColor: habitInfos.category?.color,
						borderWidth: 2,
					}}
				>
					<FontAwesome6
						name={habitInfos.category?.icon || "question"}
						size={24}
						color={habitInfos.category?.color || theme.colors.text}
						style={{ marginRight: 10 }}
					/>
					<Text
						style={{
							color: habitInfos.category?.color,
						}}
						className="text-lg text-center font-semibold"
					>
						{habitInfos.name}
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

				<View
					className="flex flex-col items-center justify-between w-11/12 mx-auto py-2 rounded-lg mt-6"
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: habitInfos.category?.color,
						borderWidth: 2,
					}}
				>
					<Text
						style={{
							color: theme.colors.text,
							borderBottomWidth: 2,
							borderBottomColor: habitInfos.category?.color || theme.colors.border,
						}}
						className="text-[16px] text-center font-semibold pb-2 w-11/12 mx-auto"
					>
						“{habitInfos.description}”
					</Text>
					<View className="flex flex-row justify-between items-center w-full mx-auto mt-4 px-5">
						<Ionicons name="time" size={24} color={theme.colors.text} />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.duration} minutes
						</Text>
					</View>

					<View className="flex flex-row justify-between items-center w-full mx-auto mt-4 px-5">
						<MaterialIcons name="category" size={24} color={theme.colors.text} />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.category?.category}
						</Text>
					</View>

					<View className="flex flex-row justify-between items-center w-full mx-auto mt-4 px-5">
						<AntDesign name="clockcircleo" size={24} color={theme.colors.text} />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							à {habitInfos.moment} heure
						</Text>
					</View>

					<View className="flex flex-row justify-between items-center w-full mx-auto mt-4 px-5">
						<AntDesign name="linechart" size={24} color={theme.colors.text} />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{difficulty}
						</Text>
					</View>
				</View>

				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] mt-4 text-center w-10/12 mx-auto font-semibold"
				>
					Derniers jours
				</Text>
				<View className="w-11/12 mx-auto mt-5 flex flex-row justify-center items-center">
					{lastDays &&
						lastDays.map((day: any, index) => (
							<View
								key={index}
								className="flex flex-col items-center justify-center mx-2"
							>
								<Checkbox
									value={day.done}
									disabled={true}
									className="w-8 h-8 mb-1"
									color={day.done ? habitInfos.color : theme.colors.text}
								/>
								<Text style={{ color: theme.colors.text }}>
									{moment(day.date, "YYYY-MM-DD").format("DD")}
								</Text>
							</View>
						))}
				</View>
			</View>
		</Animated.View>
	);
}
