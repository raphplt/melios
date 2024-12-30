import { ThemeContext, useTheme } from "@context/ThemeContext";
import { ReactNode, useContext } from "react";
import { View, Text } from "react-native";

export default function RewardDetail({
	point,
	money,
	color,
}: {
	point: number;
	money: ReactNode;
	color?: string;
}) {
	const { theme } = useTheme();

	return (
		<View className="flex flex-row items-center mx-1">
			<Text className="text-[16px] font-semibold ml-2 px-1 text-white">
				+{point}
			</Text>
			{money}
		</View>
	);
}
