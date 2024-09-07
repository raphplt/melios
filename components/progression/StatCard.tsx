import { ThemeContext } from "@context/ThemeContext";
import { ReactNode, useContext } from "react";
import { View, Text } from "react-native";

export default function StatCard({
	title,
	value,
	color,
	icon,
}: {
	title: string;
	value: string;
	color: string;
	icon: ReactNode;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="flex flex-row justify-between items-center w-2/5 mx-2 py-2 px-2 rounded-lg"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="w-2/3"
			>
				{title}
			</Text>
			<Text
				className="text-xl"
				style={{
					color: theme.colors.text,
				}}
			>
				{value}
			</Text>
		</View>
	);
}