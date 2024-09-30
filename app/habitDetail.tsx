import { useEffect, useRef } from "react";
import { View, AppState, AppStateStatus, Text, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

// Customs imports
import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import { formatTime } from "@utils/timeUtils";
import { lightenColor } from "@utils/colors";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import ButtonBack from "@components/Shared/ButtonBack";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonsBox from "@components/HabitDetail/ButtonsBox";
import { useTheme } from "@context/ThemeContext";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { currentHabit } = useHabits();

	if (!currentHabit) return <LoaderScreen text="Chargement des détails" />;

	// Contexts
	const { theme } = useTheme();

	const { timerSeconds, isTimerActive } = useTimer();
	const { startTimer } = useHabitTimer();
	const { sendPushNotification } = useNotifications();
	const { expoPushToken } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const appState = useRef(AppState.currentState);

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
				startTimer(currentHabit);
			}
		} else if (nextAppState === "background") {
			if (!expoPushToken) {
				throw new Error("No expoPushToken");
			}
			sendPushNotification(expoPushToken, {
				title: `${currentHabit.name || "Habitude"} en pause`,
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
		currentHabit.color || theme.colors.primary,
		0.1
	);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: StatusBar.currentHeight,
			}}
		>
			<ButtonBack handleQuit={() => navigation.goBack()} />
			<View className="w-full mx-auto flex justify-center flex-col pt-1">
				<HabitDetailHeader
					habit={currentHabit}
					theme={theme}
					lightenedColor={lightenedColor}
				/>

				<InfosPanel habit={currentHabit} lightenedColor={lightenedColor} />
				<LastDays habit={currentHabit} />
				<ButtonsBox />
			</View>
		</View>
	);
}
