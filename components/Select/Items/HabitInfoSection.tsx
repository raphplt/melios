import { Text, Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";

export function HabitInfoSection({
	icon,
	text,
	color,
	onPress,
}: {
	icon: string;
	text: string;
	color?: string;
	onPress?: () => void;
}) {
	const { theme } = useTheme();
	return (
		<Pressable
			className="flex flex-col items-center justify-evenly flex-1"
			onPress={onPress}
		>
			<FontAwesome6 name={icon} size={24} color={color || theme.colors.text} />
			<Text
				className="pt-2 text-center w-10/12 font-semibold"
				style={{
					color: theme.colors.text,
				}}
				numberOfLines={1}
			>
				{text}
			</Text>
		</Pressable>
	);
}
