import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function Separator() {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="flex flex-row items-center justify-center py-2">
			<View
				className="border-b border-gray-300 w-1/3 h-0.5"
				style={{
					backgroundColor: theme.colors.textTertiary,
				}}
			></View>
			<Text
				className="px-3 text-[16px]"
				style={{
					color: theme.colors.textTertiary,
				}}
			>
				ou
			</Text>
			<View
				className="border-b border-gray-300 w-1/3 h-0.5"
				style={{
					backgroundColor: theme.colors.textTertiary,
				}}
			></View>
		</View>
	);
}
