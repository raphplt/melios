import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../components/ThemContext";

export default function Activité() {
	const { theme } = useContext(ThemeContext);
	return (
		<View
			className="h-64 w-32 rounded-xl"
			style={{
				backgroundColor: theme.colors.background,
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
