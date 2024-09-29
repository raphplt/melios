import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function HabitHour({ habit }: { habit: Habit | null }) {
	const { theme } = useTheme();
	const blockStyle =
		"flex flex-row items-center justify-evenly flex-1 py-3 rounded-xl w-2/3 mx-2";
	return (
		<>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-lg mt-2 mb-2"
			>
				Heure
			</Text>

			{/* Elements du haut */}
			<View className="flex flex-row items-center justify-between py-2">
				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Personnaliser</Text>
					<Iconify
						icon="fluent:chevron-right-24-filled"
						size={20}
						color={theme.colors.text}
					/>
				</View>
				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Heure libre</Text>
					<Iconify icon="ph:calendar-dots" size={20} color={theme.colors.text} />
				</View>
			</View>

			{/* Elements du bas */}
			<View className="flex flex-row items-center justify-between py-2">
				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Matin</Text>
					<Iconify icon="ph:sun-horizon" size={20} color={theme.colors.text} />
				</View>

				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Midi</Text>
					<Iconify icon="ph:sun" size={20} color={theme.colors.text} />
				</View>

				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Soir</Text>
					<Iconify icon="ph:moon" size={20} color={theme.colors.text} />
				</View>
			</View>
		</>
	);
}
