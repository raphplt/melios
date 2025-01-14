import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { StatusBar, Alert, Text } from "react-native";
import useHabitTimer from "@hooks/useHabitTimer";
import { useHabits } from "@context/HabitsContext";
import { SoundProvider } from "@context/SoundContext";
import React from "react";

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

	return (
		<>
			<SoundProvider>
				<ContainerTimerHabit>
					<StatusBar
						barStyle={"light-content"}
						backgroundColor="transparent"
						translucent={true}
					/>
					<Text
						style={{
							fontFamily: "BaskervilleBold",
							color: "#f1f1f1",
						}}
						className="text-2xl text-center w-2/3 break-words"
					>
						{currentHabit.name}
					</Text>
					<ProgressBar />
					<BottomContainer>
						<BottomButtons />
					</BottomContainer>
				</ContainerTimerHabit>
			</SoundProvider>
		</>
	);
}