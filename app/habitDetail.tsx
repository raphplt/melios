import { useContext, useEffect, useState, useRef } from "react";
import { View, Animated, AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Customs imports
import { Habit } from "../types/habit";
import LoaderScreen from "@components/Shared/LoaderScreen";
import TimerHabit from "@components/HabitDetail/TImerHabit";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import { ThemeContext } from "@context/ThemeContext";
import useTimer from "@hooks/useTimer";
import { formatTime } from "@utils/timeUtils";
import { lightenColor } from "@utils/colors";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);

	const translateY = useRef(new Animated.Value(1000)).current;

	const [habitParsed, setHabitParsed] = useState<Habit | null>(null);
	const params = useLocalSearchParams();
	let { habit = "", habitInfos = "" } = params;
	const appState = useRef(AppState.currentState);

	const { timerSeconds, isTimerActive, startTimer } = useTimer();

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
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange
		);
		return () => subscription.remove();
	}, []);

	const handleAppStateChange = async (nextAppState: AppStateStatus) => {
		if (
			appState.current.match(/inactive|background/) &&
			nextAppState === "active"
		) {
			const remainingSeconds = await AsyncStorage.getItem("timerSeconds");
			if (remainingSeconds) {
				startTimer(parseInt(remainingSeconds) / 60, habitParsed);
			}
		} else if (nextAppState === "background") {
			if (isTimerActive) {
				await AsyncStorage.setItem("timerSeconds", timerSeconds.toString());

				await Notifications.scheduleNotificationAsync({
					content: {
						title: "Minuteur en cours",
						body: `Il reste ${formatTime(
							timerSeconds
						)} pour compléter votre habitude.`,
					},
					trigger: null,
				});
			}
		}
		appState.current = nextAppState;
	};

	const lightenedColor = lightenColor(
		habitParsed?.category?.color || theme.colors.primary,
		0.05
	);

	if (!habitParsed) return <LoaderScreen text="Chargement des détails" />;

	return (
		<Animated.View
			style={{
				backgroundColor: theme.colors.background,
				transform: [{ translateY }],
			}}
			className="h-screen w-full overflow-y-auto top-0 absolute pt-4"
		>
			<View className="mt-4 w-full mx-auto flex justify-center flex-col">
				<HabitDetailHeader
					habitParsed={habitParsed}
					theme={theme}
					lightenedColor={lightenedColor}
				/>

				<TimerHabit habit={habit} habitParsed={habitParsed} />

				<InfosPanel
					habitInfos={habitParsed}
					theme={theme}
					lightenedColor={lightenedColor}
				/>

				<LastDays habit={habit} theme={theme} />
			</View>
		</Animated.View>
	);
}
