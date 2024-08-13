import { useContext } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

export default function NumberSelected({ number }: { number: number }) {
	const { theme } = useContext(ThemeContext);
	return (
		<View
			style={{ backgroundColor: theme.colors.primary }}
			className="px-2 rounded-3xl flex flex-row items-center py-1 mx-1"
		>
			<Text style={{ color: theme.colors.textSecondary }} className="w-fit">
				{number} / 20
			</Text>
		</View>
	);
}