import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function RepeatHabit({ habit }: { habit: Habit | null }) {
	const { theme } = useTheme();
	return (
		<>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-lg mt-4 mb-2"
			>
				Répéter
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="rounded-xl py-3 mt-2 flex flex-row items-center justify-between px-2"
			>
				<Text className="w-11/12 mx-auto text-[16px]">Répéter tous les jours</Text>
				<Iconify
					icon="fluent:chevron-right-24-filled"
					size={20}
					color={theme.colors.text}
				/>
			</View>
		</>
	);
}
