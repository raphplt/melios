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
	color?: string;
	icon?: ReactNode;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="flex flex-row justify-between items-center w-2/5 mx-2 py-2 px-4 rounded-3xl"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="w-[60%] font-semibold"
			>
				{title}
			</Text>
			<View className="flex flex-row items-center">
				<Text
					className="text-lg font-bold"
					style={{
						color: theme.colors.text,
					}}
				>
					{value}
				</Text>
				<View className="ml-1">{icon}</View>
			</View>
		</View>
	);
}
