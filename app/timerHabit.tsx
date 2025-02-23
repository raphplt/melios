import React, { useEffect, useRef } from "react";
import { StatusBar, Alert, Text, AppState } from "react-native";
import {
	useNavigation,
	NavigationProp,
	ParamListBase,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { FontAwesome6 } from "@expo/vector-icons";
import notifee, { AndroidColor, EventType } from "@notifee/react-native";

import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import useHabitTimer from "@hooks/useHabitTimer";
import { useHabits } from "@context/HabitsContext";
import { SoundProvider } from "@context/SoundContext";
import { useTimer } from "@context/TimerContext";

// --- Enregistrement global du Foreground Service ---
// Ce callback s'assure que lorsque l'action "stop" est pressée dans la notif en background,
// le service s'arrête et le callback se résout avant le délai imposé par Android.
notifee.registerForegroundService((notification) => {
	return new Promise(async (resolve) => {
		const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
			if (
				type === EventType.ACTION_PRESS &&
				detail.pressAction &&
				detail.pressAction.id === "stop"
			) {
				// L'utilisateur a appuyé sur "Arrêter" en background
				await notifee.stopForegroundService();
				unsubscribe();
				resolve();
			}
		});
		// Pour éviter que la promesse ne reste en attente trop longtemps,
		// on résout automatiquement après 5 secondes
		setTimeout(() => {
			unsubscribe();
			resolve();
		}, 5000);
	});
});

export default function TimerHabit() {
	const { currentHabit } = useHabits();
	const { stopTimer, pauseTimer, startTimer } = useHabitTimer();
	const { timerSeconds, isTimerActive } = useTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const [quitHabit, setQuitHabit] = React.useState(false);
	const beforeRemoveListenerRef = useRef<any>(null);
	// Ce flag permet de s'assurer que la navigation vers "habitDetail" n'est lancée qu'une seule fois
	const hasNavigated = useRef(false);

	if (!currentHabit) return null;

	const notificationId = "foreground_notification";

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	// Affichage / mise à jour de la notification
	const displayNotification = async () => {
		const channelId = await notifee.createChannel({
			id: "foreground",
			name: "Foreground Service Channel",
			importance: 4,
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

	// Gestion de l'état de l'app : en background, on affiche la notif,
	// et lorsque l'app redevient active, on arrête le service et si l'utilisateur
	// avait cliqué sur "Arrêter", on navigue vers "habitDetail".
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (nextAppState === "active") {
				notifee.stopForegroundService();
				notifee.cancelNotification(notificationId);
				if (quitHabit && !hasNavigated.current) {
					hasNavigated.current = true;
					navigation.navigate("habitDetail");
				}
			} else {
				startForegroundNotification();
			}
		});

		return () => {
			subscription.remove();
		};
	}, [quitHabit]);

	// Démarrage du timer au montage si nécessaire
	useEffect(() => {
		if (!isTimerActive) {
			startTimer(currentHabit);
		}
	}, []);

	// Mise à jour de la notif dès que le timer change
	useEffect(() => {
		displayNotification();
	}, [timerSeconds, isTimerActive]);

	// Gestion des interactions sur la notification quand l'app est au premier plan
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

	// Lorsqu'on stoppe l'habitude : on arrête le timer, la notif et on demande la navigation.
	// Si l'app est en background, la navigation sera déclenchée au retour au premier plan.
	const handleStopHabit = async () => {
		await notifee.stopForegroundService();
		await notifee.cancelNotification(notificationId);
		await stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		if (AppState.currentState === "active") {
			hasNavigated.current = true;
			navigation.navigate("habitDetail");
		}
		// Sinon, le listener AppState se chargera de naviguer dès que l'app redeviendra active
	};

	// Confirmation avant de quitter la page
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
