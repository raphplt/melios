import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import { Switch, Text, View } from "react-native";

export default function Notifications({ habit }: { habit: Habit | null }) {
	const { theme } = useTheme();

	return (
		<>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-lg mt-4 mb-2"
			>
				Rappel
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="rounded-xl py-3 mt-2 flex flex-row items-center justify-around px-2"
			>
				<View className="flex flex-row items-center px-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="mr-4 text-[16px]"
					>
						Me rappeler
					</Text>
					<Switch />
				</View>
				<View className="flex flex-row items-center px-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="mr-4 text-[16px]"
					>
						à
					</Text>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-[16px] font-semibold"
					>
						08:00
					</Text>
				</View>
			</View>
		</>
	);
}
