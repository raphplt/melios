import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoaderScreen({ text }: { text: string }) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.colors.background,
			}}
		>
			<ActivityIndicator size="large" color={theme.colors.primary} />
			<Text style={{ color: theme.colors.text }} className="text-gray-600 mt-8">
				{text || "Chargement..."}
			</Text>
		</View>
	);
}
