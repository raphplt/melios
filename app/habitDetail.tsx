import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Animated, Pressable, PanResponder } from "react-native";
import { ThemeContext } from "../components/ThemeContext";
import { Link, useLocalSearchParams, router } from "expo-router";
import { ScrollView } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";
import moment from "moment";
import Checkbox from "expo-checkbox";

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);
	const [difficulty, setDifficulty] = useState("");
	const translateY = useRef(new Animated.Value(1000)).current;
	const [lastDays, setLastDays] = useState([]);

	// Timer
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const timerRef: any = useRef(null);

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
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}
	};

	const stopTimer = () => {
		clearInterval(timerRef.current);
		setIsTimerActive(false);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const formatTime = (seconds: any) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

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
		Animated.timing(translateY, {
			toValue: 0,
			duration: 300,
			easing: Easing.linear,
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
	}, [habit]);

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	const rgb = hexToRgb(habitInfos.category?.color);
	const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : "#FFFFFF";

	return (
		<Animated.View
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: 20,
				flex: 1,
				// transform: [{ translateY }],
			}}
			className="h-screen w-full mx-auto  border-gray-500 overflow-y-auto top-0 absolute"
		>
			<View className="flex flex-col items-center justify-center mt-4">
				<View
					className="py-2 px-6 rounded-xl w-11/12 mx-auto flex items-center flex-row justify-center"
					style={{
						backgroundColor: rgba,
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
						className="text-lg  text-center font-semibold"
					>
						{habitInfos.name}
					</Text>
				</View>
				<View>
					{!isTimerActive ? (
						<Pressable
							onPress={startTimer}
							className="py-2 px-6 rounded-xl w-11/12 mx-auto "
							style={{
								backgroundColor: theme.colors.primary,
								borderColor: theme.colors.primary,
								borderWidth: 2,
								marginTop: 10,
							}}
						>
							<Text
								className="text-lg text-center font-semibold"
								style={{ color: theme.colors.textSecondary }}
							>
								Commencer l'habitude
							</Text>
						</Pressable>
					) : (
						<Pressable onPress={stopTimer}>
							<Text>Arrêter l'habitude</Text>
						</Pressable>
					)}
					{isTimerActive && <Text>{formatTime(timerSeconds)}</Text>}
				</View>

				<View
					className="flex flex-col items-center justify-between w-11/12 mx-auto py-2  rounded-lg mt-6"
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
							{habitInfos.category.category}
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
