import { useTheme } from "@context/ThemeContext";
import { Pressable, Text } from "react-native";

export default function CreateHabitButton() {
	const { theme } = useTheme();

	return (
		<Pressable>
			<Text className="text-center text-2xl font-bold mt-10">
				Create a new habit
			</Text>
		</Pressable>
	);
}
