import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "./ThemContext";

export default function Activity() {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="h-64 w-36 rounded-xl mx-1"
			style={{
				backgroundColor: theme.colors.backgroundSecondary,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
			>
				Activity
			</Text>
		</View>
	);
}
