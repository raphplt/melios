import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Alert, Text, AppState } from "react-native";
import {
	useNavigation,
	NavigationProp,
	ParamListBase,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { FontAwesome6 } from "@expo/vector-icons";
import notifee, {
	AndroidColor,
	EventType,
	AndroidImportance,
} from "@notifee/react-native";

import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import useHabitTimer from "@hooks/useHabitTimer";
import { useHabits } from "@context/HabitsContext";
import { SoundProvider } from "@context/SoundContext";
import { useTimer } from "@context/TimerContext";

// --- Gestion des événements en background ---
// On utilise une variable module-level pour retenir si l'utilisateur a appuyé sur "Arrêter" en background.
let stopPressed = false;
notifee.onBackgroundEvent(async ({ type, detail }) => {
	if (
		type === EventType.ACTION_PRESS &&
		detail.pressAction &&
		detail.pressAction.id === "stop"
	) {
		await notifee.stopForegroundService();
		await notifee.cancelNotification("foreground_notification");
		stopPressed = true;
	}
});

export default function TimerHabit() {
	const { currentHabit } = useHabits();
	const { stopTimer, pauseTimer, startTimer } = useHabitTimer();
	const { timerSeconds, isTimerActive } = useTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const [quitHabit, setQuitHabit] = useState(false);
	// On garde en state l'état de l'app pour différencier foreground / background.
	const [isAppActive, setIsAppActive] = useState(
		AppState.currentState === "active"
	);
	const beforeRemoveListenerRef = useRef<any>(null);
	// Pour éviter de lancer la navigation plusieurs fois
	const hasNavigated = useRef(false);

	if (!currentHabit) return null;

	const notificationId = "foreground_notification";

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	// Affichage de la notif avec une importance adaptée à l'état de l'app
	const displayNotification = async () => {
		const channelId = await notifee.createChannel({
			id: "foreground",
			name: "Foreground Service Channel",
			importance: isAppActive ? AndroidImportance.LOW : AndroidImportance.HIGH,
		});

		await notifee.displayNotification({
			id: notificationId,
			title: "Timer en cours",
			body: `${currentHabit.name} - ${formatTime(timerSeconds)}`,
			android: {
				channelId,
				asForegroundService: true,
				color: AndroidColor.WHITE,
				colorized: true,
				// En foreground, on utilise une importance faible pour éviter le pop-up
				importance: isAppActive ? AndroidImportance.LOW : AndroidImportance.HIGH,
				autoCancel: true,
				actions: [
					{
						title: isTimerActive ? "Pause" : "Reprendre",
						pressAction: { id: "pause" },
					},
					{
						title: "Arrêter",
						pressAction: { id: "stop" },
					},
				],
				pressAction: { id: "default", launchActivity: "default" },
			},
		});
	};

	const startForegroundNotification = async () => {
		await displayNotification();
	};

	// Gestion de l'état de l'application via AppState.
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			const active = nextAppState === "active";
			setIsAppActive(active);
			if (active) {
				// Dès que l'app redevient active, on annule la notif.
				notifee.stopForegroundService();
				notifee.cancelNotification(notificationId);
				// Si l'utilisateur a appuyé sur "Arrêter" en background, on déclenche l'arrêt complet.
				if (stopPressed && !hasNavigated.current) {
					hasNavigated.current = true;
					handleStopHabit();
					stopPressed = false;
				}
			} else {
				// En background, on affiche la notif avec importance élevée.
				startForegroundNotification();
			}
		});
		return () => {
			subscription.remove();
		};
	}, [quitHabit, isAppActive]);

	// Au montage, on démarre le timer si nécessaire.
	useEffect(() => {
		if (!isTimerActive) {
			startTimer(currentHabit);
		}
	}, []);

	// Mise à jour de la notif uniquement si l'app n'est pas active.
	useEffect(() => {
		if (!isAppActive) {
			displayNotification();
		}
	}, [timerSeconds, isTimerActive, isAppActive]);

	// Gestion des interactions en foreground sur la notif.
	useEffect(() => {
		const subscription = notifee.onForegroundEvent(async ({ type, detail }) => {
			if (type === EventType.PRESS) {
				if (detail.pressAction?.id === "default") {
					navigation.navigate("timerHabit");
				}
			} else if (type === EventType.ACTION_PRESS && detail.pressAction) {
				if (detail.pressAction.id === "stop") {
					handleStopHabit();
				} else if (detail.pressAction.id === "pause") {
					pauseTimer();
				}
			}
		});
		return () => subscription();
	}, []);

	// Action d'arrêt de l'habitude : arrêter la notif, le timer, et naviguer.
	const handleStopHabit = async () => {
		await notifee.stopForegroundService();
		await notifee.cancelNotification(notificationId);
		await stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		if (isAppActive) {
			hasNavigated.current = true;
			navigation.goBack();
		}
		// Si l'app est en background, le listener AppState déclenchera la navigation dès qu'elle redeviendra active.
	};

	// Confirmation avant de quitter la page.
	useEffect(() => {
		const beforeRemoveListener = (e: any) => {
			if (!quitHabit) {
				e.preventDefault();
				Alert.alert(
					"Êtes-vous sûr de vouloir arrêter cette habitude ?",
					"La progression actuelle sera perdue",
					[
						{ text: "Annuler", style: "cancel" },
						{
							text: "Arrêter",
							style: "destructive",
							onPress: () => handleStopHabit(),
						},
					]
				);
			}
		};

		beforeRemoveListenerRef.current = beforeRemoveListener;
		const unsubscribe = navigation.addListener(
			"beforeRemove",
			beforeRemoveListener
		);
		return unsubscribe;
	}, [navigation, quitHabit]);

	return (
		<SoundProvider>
			<ContainerTimerHabit>
				<StatusBar
					barStyle={"light-content"}
					backgroundColor="transparent"
					translucent={true}
				/>
				<BlurView
					tint="systemThinMaterialDark"
					intensity={75}
					className="p-4 rounded-lg flex flex-col items-center justify-center gap-y-2 w-10/12"
					style={{ overflow: "hidden" }}
				>
					<FontAwesome6
						name={currentHabit.icon}
						size={24}
						color={currentHabit.color}
					/>
					<Text
						style={{ fontFamily: "BaskervilleBold", color: "#f1f1f1" }}
						className="text-2xl text-center w-2/3"
					>
						{currentHabit.name}
					</Text>
					<Text
						style={{ fontFamily: "BaskervilleBold", color: "#d1d1d1" }}
						className="text-sm"
					>
						{currentHabit.description}
					</Text>
				</BlurView>
				<ProgressBar />
				<BottomContainer>
					<BottomButtons />
				</BottomContainer>
			</ContainerTimerHabit>
		</SoundProvider>
	);
}
