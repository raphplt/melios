import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function HabitDetailHeader({
	habitParsed,
	theme,
	lightenedColor,
}: {
	habitParsed: any;
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
				name={habitParsed.category?.icon || "question"}
				size={24}
				color={habitParsed.category?.color || theme.colors.text}
				style={{ marginRight: 14 }}
			/>
			<Text
				style={{
					color: habitParsed.category?.color,
					fontFamily: "BaskervilleBold",
				}}
				className="text-lg text-center font-semibold"
			>
				{habitParsed.name}
			</Text>
		</View>
	);
}
