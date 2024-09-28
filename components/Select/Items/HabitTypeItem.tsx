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
			className="w-[45%] rounded-xl flex flex-col items-center justify-center p-4 pt-5 mx-2"
			style={{
				backgroundColor:
					type === typeHabit ? bgColorSelected : theme.colors.cardBackground,
				borderColor: type === typeHabit ? bgColorSelected : theme.colors.border,
				borderWidth: 2,
			}}
			onPress={onPress}
		>
			{icon}
			<Text
				className="text-[16px] text-center pt-3 font-semibold"
				style={{
					color: type === typeHabit ? "#fff" : theme.colors.text,
				}}
			>
				{name}
			</Text>
		</Pressable>
	);
}
