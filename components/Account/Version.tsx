import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function Version() {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="w-full mx-auto"
			style={{ backgroundColor: theme.colors.background }}
		>
			<Text className=" text-center text-sm" style={{ color: theme.colors.text }}>
				Melios v1.1.2 - © 2024 Melios. Tous droits réservés.
			</Text>
		</View>
	);
}
