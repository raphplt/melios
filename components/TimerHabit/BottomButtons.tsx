import { ThemeContext } from "@context/ThemeContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { useContext, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

export default function BottomButtons() {
	const { theme } = useContext(ThemeContext);
	const [sound, setSound] = useState<Sound>();

	const { pauseTimer } = useHabitTimer();
	const { isTimerActive } = useTimer();

	async function playSound() {
		console.log("Loading Sound");
		const { sound } = await Audio.Sound.createAsync(
			require("@assets/sounds/rain.wav")
		);
		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	}

	useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	return (
		<View className="flex flex-row items-center justify-evenly">
			<Pressable
				onPress={playSound}
				className="py-2 rounded-full mx-auto flex flex-row items-center justify-center w-16 h-16"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<Iconify
					icon="material-symbols:volume-up"
					size={28}
					color={theme.colors.textSecondary}
				/>
			</Pressable>

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
		</View>
	);
}
