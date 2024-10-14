import { FontAwesome6 } from "@expo/vector-icons";
import { UserHabit } from "@type/userHabit";
import { Text, View } from "react-native";

export default function HabitDetailHeader({
	habit,
	theme,
	lightenedColor,
}: {
	habit: UserHabit;
	theme: any;
	lightenedColor: string;
}) {
	return (
		<View
			className="py-3 px-6 rounded-lg w-11/12 mx-auto flex items-center flex-row justify-center"
			style={{
				backgroundColor: lightenedColor,
			}}
		>
			<FontAwesome6
				name={habit.icon || "question"}
				size={24}
				color={habit.color || theme.colors.text}
				style={{ marginRight: 15 }}
			/>
			<Text
				style={{
					color: habit.color || theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-lg text-center font-semibold"
			>
				{habit.name}
			</Text>
		</View>
	);
}
