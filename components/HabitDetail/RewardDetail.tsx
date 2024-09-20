import { ThemeContext } from "@context/ThemeContext";
import { ReactNode, useContext } from "react";
import { View, Text } from "react-native";

export default function RewardDetail({
	point,
	money,
}: {
	point: number;
	money: ReactNode;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="flex flex-row items-center rounded-3xl p-1 mx-1"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-[16px] font-semibold ml-2 px-1"
			>
				+ {point}
			</Text>
			{money}
		</View>
	);
}
