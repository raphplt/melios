import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

export default function HabitTypeBox({
	icon,
	name,
	bgColor,
	bgColorSelected,
	typeHabit,
	onPress,
}: {
	icon: ReactNode;
	name: string;
	bgColor?: string;
	bgColorSelected?: string;
	typeHabit: string;
	onPress?: () => void;
}) {
	const { theme } = useTheme();
	const { type } = useSelect();
	return (
		<Pressable
			className="w-[30%] h rounded-xl flex flex-col items-center justify-center p-4 pt-5"
			style={{
				backgroundColor: type === typeHabit ? bgColorSelected : bgColor,
			}}
			onPress={onPress}
		>
			{icon}
			<Text
				className="text-lg text-center pt-3 font-semibold"
				style={{
					color: theme.colors.text,
				}}
			>
				{name}
			</Text>
		</Pressable>
	);
}
