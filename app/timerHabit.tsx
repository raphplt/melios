import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ImageBox from "@components/TimerHabit/ImageBox";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { StatusBar, Alert } from "react-native";
import useHabitTimer from "@hooks/useHabitTimer";

export default function TimerHabit() {
	const [quitHabit, setQuitHabit] = useState(false);
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { stopTimer } = useHabitTimer();
	const beforeRemoveListenerRef = useRef<any>(null);

	const handleStopHabit = () => {
		stopTimer();
		setQuitHabit(true);
		if (beforeRemoveListenerRef.current) {
			navigation.removeListener("beforeRemove", beforeRemoveListenerRef.current);
		}
		navigation.goBack();
		console.log("Habit stopped");
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
			<ContainerTimerHabit>
				<StatusBar
					barStyle={"light-content"}
					backgroundColor="transparent"
					translucent={true}
				/>
				<ImageBox />
				<BottomContainer>
					<ProgressBar />
					<BottomButtons />
				</BottomContainer>
			</ContainerTimerHabit>
		</>
	);
}