import { useHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import { useTimer } from "@context/TimerContext";
import { formatRemainingTime, formatTime } from "@utils/timeUtils";
import { useContext, useEffect, useRef } from "react";
import { View, Dimensions, Animated, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

export default function ProgressBar() {
	const { theme } = useContext(ThemeContext);
	const { currentHabit } = useHabits();
	const { timerSeconds, isTimerActive } = useTimer();
	const { width } = Dimensions.get("window");

	if (!currentHabit?.habit) return null;

	const totalSeconds = currentHabit.habit.duration * 60;
	const remainingTime = formatRemainingTime(timerSeconds, totalSeconds);

	const blinkAnim = useRef(new Animated.Value(1)).current;
	const animationRef = useRef<Animated.CompositeAnimation | null>(null);

	useEffect(() => {
		if (!isTimerActive) {
			animationRef.current = Animated.loop(
				Animated.sequence([
					Animated.timing(blinkAnim, {
						toValue: 0,
						duration: 0,
						useNativeDriver: true,
					}),
					Animated.delay(500),
					Animated.timing(blinkAnim, {
						toValue: 1,
						duration: 0,
						useNativeDriver: true,
					}),
					Animated.delay(500),
				])
			);
			animationRef.current.start();
		} else {
			if (animationRef.current) {
				animationRef.current.stop();
			}
			blinkAnim.setValue(1);
		}
	}, [isTimerActive]);

	return (
		<View className="py-3 flex items-center justify-center">
			<Progress.Circle
				size={width * 0.75}
				thickness={10}
				progress={1 - timerSeconds / totalSeconds}
				borderColor="transparent"
				unfilledColor={theme.colors.border}
				color={theme.colors.primary}
				borderWidth={0}
			/>
			<Animated.Text
				style={[
					{
						color: "#f1f1f1",
						opacity: blinkAnim,
						fontSize: 60,
						fontWeight: "600",
					},
				]}
				className="absolute"
			>
				{formatTime(timerSeconds)}
			</Animated.Text>
		</View>
	);
}