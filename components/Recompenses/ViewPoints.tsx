import { Text, View } from "react-native";
import MoneyMelios from "@components/Svg/MoneyMelios";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";

export default function ViewPoints() {
	const { theme } = useContext(ThemeContext);

	const { points } = useData();
	return (
		<View className="flex flex-row items-center justify-between">
			<Text
				style={{
					color: theme.colors.primary,
				}}
				className="font-semibold mr-1 text-[16px]"
			>
				{points.odyssee}
			</Text>
			<MoneyOdyssee />

			<Text
				className="font-semibold mr-1 text-[16px] ml-3"
				style={{
					color: theme.colors.primary,
				}}
			>
				{points.rewards}
			</Text>
			<MoneyMelios />
		</View>
	);
}
