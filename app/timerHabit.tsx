import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { StatusBar, Alert, Text, AppState } from "react-native";
import useHabitTimer from "@hooks/useHabitTimer";
import { useHabits } from "@context/HabitsContext";
import { SoundProvider } from "@context/SoundContext";
import React from "react";
import { BlurView } from "expo-blur";
import { FontAwesome6 } from "@expo/vector-icons";
import notifee, { AndroidColor } from "@notifee/react-native";

export default function TimerHabit() {
	const { currentHabit } = useHabits();
	const { stopTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const [quitHabit, setQuitHabit] = useState(false);
	const beforeRemoveListenerRef = useRef<any>(null);

	if (!currentHabit) return null;

	const handleStopHabit = () => {
		stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		navigation.goBack();
	};

	useEffect(() => {
		const beforeRemoveListener = (e: any) => {
			if (!quitHabit) {
				e.preventDefault();
				Alert.alert(
					"Êtes-vous sûr de vouloir arrêter cette habitude ?",
					"La progression actuelle sera perdue",
					[
						{
							text: "Annuler",
							style: "cancel",
							onPress: () => {},
						},
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

	useEffect(() => {
		const subscription = AppState.addEventListener("change", async (state) => {
			if (state === "background" && currentHabit) {
				await notifee.displayNotification({
					title: currentHabit.name,
					body: "Le timer est toujours actif.",
					android: {
						channelId: "foreground_service",
						asForegroundService: true,
						color: AndroidColor.RED,
					},
				});
			}
		});

		return () => subscription.remove();
	}, [currentHabit]);

	return (
		<SoundProvider>
			<ContainerTimerHabit>
				<StatusBar
					barStyle={"light-content"}
					backgroundColor="transparent"
					translucent={true}
				/>
				<BlurView
					tint="default"
					intensity={75}
					className="p-4 rounded-lg flex flex-col items-center justify-center gap-y-2 w-10/12"
					style={{
						overflow: "hidden",
					}}
				>
					<FontAwesome6
						name={currentHabit.icon}
						size={24}
						color={currentHabit.color}
					/>
					<Text
						style={{
							fontFamily: "BaskervilleBold",
							color: "#f1f1f1",
						}}
						className="text-2xl text-center w-2/3"
					>
						{currentHabit.name}
					</Text>
					<Text
						style={{
							fontFamily: "BaskervilleBold",
							color: "#d1d1d1",
						}}
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