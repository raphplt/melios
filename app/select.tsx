import { useTheme } from "@context/ThemeContext";
import { View, Text } from "react-native";

export default function Select() {
	const { theme } = useTheme();
	return (
		<View
			className="min-h-screen"
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<Text className="text-center text-2xl font-bold mt-10">
				Select your habits
			</Text>
		</View>
	);
}
