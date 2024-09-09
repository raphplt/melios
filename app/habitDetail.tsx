import { useContext, useEffect, useRef } from "react";
import { View, Animated, AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Customs imports
import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import { ThemeContext } from "@context/ThemeContext";
import { formatTime } from "@utils/timeUtils";
import { lightenColor } from "@utils/colors";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { HabitsContext, useHabits } from "@context/HabitsContext";
import TimerHabit from "@components/HabitDetail/TimerHabit";
import ButtonStartHabit from "@components/HabitDetail/ButtonStartHabit";
import { TimerProvider, useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { currentHabit } = useContext(HabitsContext);

	if (!currentHabit) return <LoaderScreen text="Chargement des détails" />;

	// Contexts
	const { theme } = useContext(ThemeContext);
	const { timerSeconds, isTimerActive } = useTimer();
	const { startTimer } = useHabitTimer();
	const { sendPushNotification } = useNotifications();
	const { showHabitDetail } = useHabits();

	const translateY = useRef(new Animated.Value(1000)).current;
	const appState = useRef(AppState.currentState);
	const { expoPushToken } = useData();

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
				startTimer(parseInt(remainingSeconds) / 60, currentHabit.habit);
			}
		} else if (nextAppState === "background") {
			if (!expoPushToken) {
				throw new Error("No expoPushToken");
			}
			sendPushNotification(expoPushToken, {
				title: `${currentHabit.habit.name || "Habitude"} en pause`,
				body: `Cliquez pour revenir sur votre habitude en cours.`, //TODO temps restant
			}); //TODO supprimer la notification quand on revient sur l'app
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
		currentHabit.habit.category.color || theme.colors.primary,
		0.1
	);

	if (!currentHabit) return <LoaderScreen text="Chargement des détails" />;

	console.log("timerSeconds", timerSeconds);

	return (
		<TimerProvider>
			<Animated.View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="h-screen w-full overflow-y-auto top-0 absolute"
			>
				{!showHabitDetail && (
					<View className="mt-4 w-full mx-auto flex justify-center flex-col  pt-4">
						<>
							<HabitDetailHeader
								habit={currentHabit.habit}
								theme={theme}
								lightenedColor={lightenedColor}
							/>

							<InfosPanel
								habit={currentHabit.habit}
								theme={theme}
								lightenedColor={lightenedColor}
							/>
							<LastDays habit={currentHabit.userHabit} />
							<ButtonStartHabit habit={currentHabit.habit} />
						</>
					</View>
				)}
				<TimerHabit />
			</Animated.View>
		</TimerProvider>
	);
}
