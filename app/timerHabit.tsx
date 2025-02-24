import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Alert, Text, AppState } from "react-native";
import {
	useNavigation,
	NavigationProp,
	ParamListBase,
	useRoute,
	useIsFocused,
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
import { useTheme } from "@context/ThemeContext";

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
	const { theme } = useTheme();
	const route = useRoute();
	const isFocused = useIsFocused();

	const [quitHabit, setQuitHabit] = useState(false);
	const [isAppActive, setIsAppActive] = useState(
		AppState.currentState === "active"
	);
	const beforeRemoveListenerRef = useRef<any>(null);
	const hasNavigated = useRef(false);

	if (!currentHabit) return null;

	const notificationId = "foreground_notification";

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	const displayNotification = async () => {
		const channelId = await notifee.createChannel({
			id: "foreground",
			name: "Foreground Service Channel",
			importance: isAppActive ? AndroidImportance.LOW : AndroidImportance.HIGH,
		});

		await notifee.displayNotification({
			id: notificationId,
			title: `${currentHabit.name}`,
			body: `Temps restant : ${formatTime(timerSeconds)}`,
			android: {
				channelId,
				asForegroundService: true,
				color: AndroidColor.WHITE,
				colorized: true,
				importance: isAppActive ? AndroidImportance.LOW : AndroidImportance.HIGH,
				autoCancel: true,
				actions: [
					{
						title: isTimerActive ? "Pause" : "Reprendre",
						pressAction: { id: "pause" },
					},
					{
						title: "Arrêter",
						pressAction: { id: "stop", launchActivity: "default" },
					},
				],
				pressAction: { id: "default", launchActivity: "default" },
			},
		});
	};

	const startForegroundNotification = async () => {
		await displayNotification();
	};

	useEffect(() => {
		if (!isFocused) {
			return;
		}

		const subscription = AppState.addEventListener("change", (nextAppState) => {
			const active = nextAppState === "active";
			setIsAppActive(active);
			if (active) {
				if (route.name !== "habitDetail") {
					notifee.stopForegroundService();
				}
				if (stopPressed && !hasNavigated.current) {
					hasNavigated.current = true;
					handleStopHabit();
					stopPressed = false;
				}
			} else {
				startForegroundNotification();
			}
		});
		return () => {
			subscription.remove();
		};
	}, [isFocused, quitHabit, isAppActive, route.name, stopPressed]);

	useEffect(() => {
		if (!isTimerActive) {
			startTimer(currentHabit);
		}
	}, []);

	useEffect(() => {
		if (!isAppActive && !quitHabit) {
			displayNotification();
		}
	}, [timerSeconds, isTimerActive, isAppActive, quitHabit]);

	useEffect(() => {
		const subscription = notifee.onForegroundEvent(async ({ type, detail }) => {
			if (type === EventType.PRESS) {
				if (detail.pressAction?.id === "default") {
					navigation.navigate("timerHabit");
				}
			} else if (type === EventType.ACTION_PRESS && detail.pressAction) {
				if (detail.pressAction.id === "stop") {
				} else if (detail.pressAction.id === "return") {
					navigation.navigate("timerHabit");
				} else if (detail.pressAction.id === "pause") {
					pauseTimer();
				}
			}
		});
		return () => subscription();
	}, []);

	const handleStopHabit = async () => {
		navigation.navigate("(navbar)");
		await notifee.stopForegroundService();
		await stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		if (isAppActive) {
			hasNavigated.current = true;
			navigation.navigate("(navbar)");
		}
	};

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
					tint="extraLight"
					intensity={100}
					className="p-4 rounded-lg flex flex-col items-center justify-center gap-y-2 w-11/12"
					style={{
						overflow: "hidden",

						elevation: 1,
					}}
				>
					<FontAwesome6
						name={currentHabit.icon}
						size={24}
						color={currentHabit.color}
					/>
					<Text
						style={{ fontFamily: "BaskervilleBold", color: "#010101" }}
						className="text-xl text-center w-10/12"
					>
						{currentHabit.name}
					</Text>
					<Text
						className="mt-1 font-semibold"
						style={{
							color: "#010101",
						}}
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