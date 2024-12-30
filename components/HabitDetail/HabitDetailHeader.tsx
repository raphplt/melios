import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { UserHabit } from "@type/userHabit";
import { BlurView } from "expo-blur";
import { Text, View } from "react-native";

export default function HabitDetailHeader({
	habit,
	lightenedColor,
}: {
	habit: UserHabit;
	lightenedColor: string;
}) {
	const { theme } = useTheme();
		const dark = theme.dark;
		const textColor = dark ? theme.colors.textSecondary : theme.colors.text;
		return (
			<BlurView
				intensity={70}
				className="py-5 px-6 rounded-xl w-11/12 mx-auto flex items-center flex-row justify-center"
				style={{
					overflow: "hidden",
				}}
			>
				<FontAwesome6
					name={habit.icon || "question"}
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
					{habit.name}
				</Text>
			</BlurView>
		);
}
