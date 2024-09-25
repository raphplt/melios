import { ThemeContext } from "@context/ThemeContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { useContext, useState } from "react";
import { Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";
import SoundsModal from "@components/Modals/SoundsModal";
import { useSound } from "@context/SoundContext";

export default function BottomButtons() {
	const { theme } = useContext(ThemeContext);

	const [visible, setVisible] = useState(false);

	const { pauseTimer } = useHabitTimer();
	const { isTimerActive } = useTimer();
	const { currentSound } = useSound();

	const openSoundsModal = () => {
		setVisible(true);
	};

	return (
		<View className="flex flex-row items-center justify-evenly w-full">
			<Pressable
				onPress={pauseTimer}
				className="py-2 rounded-full mx-auto flex flex-row items-center justify-center w-16 h-16"
				style={{
					backgroundColor: theme.colors.border,
				}}
			>
				<Iconify icon="mdi:restart" size={28} color={theme.colors.primary} />
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

			<Pressable
				onPress={openSoundsModal}
				className="py-2 rounded-full mx-auto flex flex-row items-center justify-center w-16 h-16"
				style={{
					backgroundColor: theme.colors.border,
				}}
			>
				{currentSound ? (
					<Iconify
						icon="material-symbols:volume-up"
						size={28}
						color={theme.colors.primary}
					/>
				) : (
					<Iconify
						icon="material-symbols:volume-off"
						size={28}
						color={theme.colors.primary}
					/>
				)}
			</Pressable>
			<SoundsModal visible={visible} setVisible={setVisible} onChange={() => {}} />
		</View>
	);
}
