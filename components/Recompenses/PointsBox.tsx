import { ThemeContext, useTheme } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";
import ViewPoints from "./ViewPoints";

export default function PointsBox() {
	const { theme } = useTheme();

	return (
		<View
			className="flex flex-row justify-between items-center my-3 mx-auto rounded-xl py-4 px-3 w-11/12"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<Text
				className="text-center text-lg font-bold"
				style={{
					color: theme.colors.primary,
				}}
			>
				Mes points
			</Text>
			<ViewPoints />
		</View>
	);
}
