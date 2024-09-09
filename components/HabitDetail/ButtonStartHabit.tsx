import { ThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useHabitTimer from "@hooks/useHabitTimer";
import { Habit } from "@type/habit";
import { useContext } from "react";
import { Pressable, Text } from "react-native";

export default function ButtonStartHabit({ habit }: { habit: Habit }) {
	const { theme } = useContext(ThemeContext);

	const { startTimer } = useHabitTimer();

	return (
		<Pressable
			onPress={() => startTimer(habit.duration, habit)}
			className="mt-10 py-2 px-6 rounded-lg w-11/12 mx-auto justify-center flex flex-row items-center"
			style={{
				backgroundColor: theme.colors.primary,
			}}
		>
			<Ionicons name="play" size={24} color={theme.colors.textSecondary} />
			<Text
				className="text-lg text-center font-semibold ml-2"
				style={{ color: theme.colors.textSecondary }}
			>
				Commencer l'habitude
			</Text>
		</Pressable>
	);
}
