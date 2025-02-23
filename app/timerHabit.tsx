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

export default function TimerHabit() {
	const { currentHabit } = useHabits();
	const { stopTimer, pauseTimer, startTimer } = useHabitTimer();
	const { timerSeconds, isTimerActive } = useTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const [quitHabit, setQuitHabit] = React.useState(false);
	const beforeRemoveListenerRef = useRef<any>(null);

	if (!currentHabit) return null;

	// ID fixe pour la notification
	const notificationId = "foreground_notification";

	// Formatage du temps en mm:ss
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	// Création / mise à jour de la notif en foreground
	const updateForegroundNotification = async () => {
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
				// Actions affichées en bas de la notif
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
				// Action par défaut lors d'un clic sur la notif (en dehors des boutons)
				pressAction: { id: "default", launchActivity: "default" },
			},
		});
	};

	// Lance la notif en background
	const startForegroundNotification = async () => {
		await updateForegroundNotification();
	};

	// On écoute l'état de l'application pour afficher/cacher la notif
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (nextAppState !== "active") {
				// L'app passe en background ou inactive → on affiche la notif
				startForegroundNotification();
			} else {
				// L'app est active → on cache la notif
				notifee.stopForegroundService();
				notifee.cancelNotification(notificationId);
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);

	// Au montage, on démarre le timer s'il n'est pas déjà actif
	useEffect(() => {
		if (!isTimerActive) {
			startTimer(currentHabit);
		}
	}, []);

	// On met à jour la notif dès que le timer change
	useEffect(() => {
		updateForegroundNotification();
	}, [timerSeconds, isTimerActive]);

	// Gestion des interactions sur la notification (clic sur le corps et sur les actions)
	useEffect(() => {
		const subscription = notifee.onForegroundEvent(async ({ type, detail }) => {
			if (type === EventType.PRESS) {
				// Clic sur le corps de la notif → ramener l'app au premier plan sur la page en cours
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

	// Fonction d'arrêt de l'habitude
	const handleStopHabit = async () => {
		await notifee.stopForegroundService();
		await notifee.cancelNotification(notificationId);
		await stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		navigation.goBack();
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
						{ text: "Annuler", style: "cancel", onPress: () => {} },
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
