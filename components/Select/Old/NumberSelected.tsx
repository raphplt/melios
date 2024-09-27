import { useTheme } from "@context/ThemeContext";
import { Text } from "react-native";
import { View } from "react-native";

export default function NumberSelected({ number }: { number: number }) {
	const { theme } = useTheme();
	return (
		<View
			style={{ backgroundColor: theme.colors.primary }}
			className="px-3 rounded-3xl flex flex-row items-center py-3 mx-1"
		>
			<Text className="w-fit font-bold text-white">{number}/20</Text>
		</View>
	);
}
