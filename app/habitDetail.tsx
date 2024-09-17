import { useContext, useEffect, useRef } from "react";
import { View, AppState, AppStateStatus, Text, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

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
import { HabitsContext } from "@context/HabitsContext";
import ButtonStartHabit from "@components/HabitDetail/ButtonStartHabit";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import ButtonBack from "@components/Shared/ButtonBack";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonComplete from "@components/HabitDetail/ButtonComplete";

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
				<ButtonStartHabit combinedHabit={currentHabit} />
				<ButtonComplete combinedHabit={currentHabit} />
				{/* TODO: bouton compléter normalement ? */}
			</View>
		</View>
	);
}
