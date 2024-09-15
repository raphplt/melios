import { ThemeContext } from "@context/ThemeContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function BottomButtons() {
	const { theme } = useContext(ThemeContext);

	const { pauseTimer } = useHabitTimer();
	const { isTimerActive } = useTimer();

	return (
		<Pressable
			onPress={pauseTimer}
			className="py-2 rounded-full mx-auto flex flex-row items-center justify-center w-16 h-16"
			style={{
				backgroundColor: theme.colors.primary,
			}}
		>
			{isTimerActive ? (
				<Iconify
					icon="material-symbols:pause"
					size={28}
					color={theme.colors.textSecondary}
				/>
			) : (
				<Iconify
					icon="material-symbols:play-arrow"
					size={28}
					color={theme.colors.textSecondary}
				/>
			)}
		</Pressable>
	);
}
