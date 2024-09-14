import { ThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useHabitTimer from "@hooks/useHabitTimer";
import { Habit } from "@type/habit";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

export default function ButtonStartHabit({ habit }: { habit: Habit }) {
	const { theme } = useContext(ThemeContext);

	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handleTouchStart = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleTouchEnd = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	const { startTimer } = useHabitTimer();

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
		>
			<Pressable
				onPress={() => startTimer(habit.duration, habit)}
				className="mt-10 py-2 px-6 rounded-lg w-11/12 mx-auto justify-center flex flex-row items-center"
				style={{
					backgroundColor: theme.colors.primary,
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				<Ionicons name="play" size={24} color={theme.colors.textSecondary} />
				<Text
					className="text-lg text-center font-semibold ml-2"
					style={{ color: theme.colors.textSecondary }}
				>
					Commencer l'habitude
				</Text>
			</Pressable>
		</Animated.View>
	);
}
