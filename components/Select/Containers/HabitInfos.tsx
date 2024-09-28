import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { Habit } from "@type/habit";
import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function HabitInfos({ habit }: { habit: Habit | null }) {
	const { theme } = useTheme();
	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
			}}
			className="rounded-xl py-3 mt-4 flex flex-row items-center justify-between"
		>
			<View className="flex items-center justify-evenly flex-1">
				<Iconify icon="mdi:heart-outline" size={24} color={theme.colors.text} />
				<Text className="py-2">{habit?.type || "Personnalisé"}</Text>
			</View>
			<View
				className="flex items-center justify-center h-full "
				style={{
					backgroundColor: theme.colors.grayPrimary,
					width: 1,
				}}
			/>
			<View className="flex items-center justify-evenly flex-1">
				<FontAwesome6 name={habit?.category.icon} size={24} />
				<Text className="py-2  w-10/12  text-center">
					{habit?.category.category || "Personnalisé"}
				</Text>
			</View>
			<View
				className="flex items-center justify-center h-full "
				style={{
					backgroundColor: theme.colors.grayPrimary,
					width: 1,
				}}
			/>
			<View className="flex items-center justify-evenly flex-1">
				<View
					className="w-6 h-6 rounded-full"
					style={{
						backgroundColor: habit?.category.color || theme.colors.text,
					}}
				/>
				<Text className="py-2">{habit?.category.color || "Personnalisé"}</Text>
			</View>
		</View>
	);
}
