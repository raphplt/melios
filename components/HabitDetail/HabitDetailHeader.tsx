import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Text } from "react-native";

export default function HabitDetailHeader() {
	const { theme } = useTheme();
	const dark = theme.dark;
	const textColor = dark ? theme.colors.textSecondary : theme.colors.text;
	const { currentHabit } = useHabits();

	if (!currentHabit) return null;

	return (
		<BlurView
			intensity={70}
			className="py-5 px-6 rounded-xl w-11/12 mx-auto flex items-center flex-row justify-center"
			style={{
				overflow: "hidden",
			}}
			tint="extraLight"
		>
			<FontAwesome6
				name={currentHabit.icon || "question"}
				size={24}
				color={textColor}
				style={{ marginRight: 15 }}
			/>
			<Text
				style={{
					color: textColor,
					fontFamily: "BaskervilleBold",
				}}
				className="text-lg text-center font-semibold"
			>
				{currentHabit.name}
			</Text>
		</BlurView>
	);
}
