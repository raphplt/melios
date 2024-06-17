import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "./ThemeContext";
import { useData } from "../constants/DataContext";
import MoneyMelios from "./Svg/MoneyMelios";
import MoneyOdyssee from "./Svg/MoneyOdyssee";

export default function Points() {
	const { theme } = useContext(ThemeContext);
	const { points } = useData();

	return (
		<View
			className="flex items-center flex-row rounded-full"
			style={{
				backgroundColor: theme.colors.blueSecondary,
				borderColor: theme.colors.primary,
				borderWidth: 1,
			}}
		>
			<View
				className="flex items-center justify-center flex-row  py-1 px-2 ml-1 rounded-l-full"
				style={{
					backgroundColor: theme.colors.blueSecondary,
				}}
			>
				<Text
					style={{
						color: theme.colors.primary,
						fontSize: 16,
					}}
					className="font-bold mr-1"
				>
					{points.odyssee}
				</Text>
				<MoneyOdyssee />
			</View>
			<View
				className="flex items-center justify-center flex-row  py-1 px-4 rounded-full"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<Text
					style={{
						color: "#DBBB16",
						fontSize: 16,
					}}
					className="font-bold mr-1"
				>
					{points.rewards}
				</Text>
				<MoneyMelios />
			</View>
		</View>
	);
}
