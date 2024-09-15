import { ThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Habit } from "@type/habit";
import { useNavigation } from "expo-router";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

export default function ButtonStartHabit({ habit }: { habit: Habit }) {
	const { theme } = useContext(ThemeContext);
	const { startTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

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

	const handlePress = () => {
		startTimer(habit.duration, habit);
		navigation.navigate("timerHabit");
	};

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
		>
			<Pressable
				onPress={handlePress}
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
