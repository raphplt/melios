import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export const HabitCard = ({ statistic, text, theme }: any) => {
	const [fillPercentage, setFillPercentage]: any = useState("");
	const [fillColor, setFillColor]: any = useState("");
	const [fillColorLastDays, setFillColorLastDays]: any = useState("");

	useEffect(() => {
		if (text == "complétées") {
			setFillPercentage(`${statistic}%`);
			if (0 <= statistic && statistic <= 25) {
				setFillColor(theme.colors.redPrimary);
			}
			if (25 < statistic && statistic <= 50) {
				setFillColor(theme.colors.yellowSecondary);
			}
			if (50 < statistic && statistic <= 75) {
				setFillColor(theme.colors.greenSecondary);
			}
			if (75 < statistic && statistic <= 100) {
				setFillColor(theme.colors.greenPrimary);
			}
		} else if (text == "vs hier") {
			if (statistic > 0) {
				setFillColorLastDays(theme.colors.greenSecondary);
			} else setFillColorLastDays(`${theme.colors.redSecondary}`);
		}
	}, [statistic]);

	return (
		<View
			style={{
				backgroundColor: fillColorLastDays || theme.colors.backgroundSecondary,
				borderWidth: 1,
				borderColor: theme.colors.border,
			}}
			className="flex items-center justify-center w-36 h-36 rounded-lg "
		>
			<View
				style={{
					position: "absolute",
					backgroundColor: fillColor || "#DCFCE7",
					height: fillPercentage,
					width: "100%",
					bottom: 0,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,
				}}
			></View>
			<Text style={{ color: "black" }} className="text-3xl mt-1">
				{text == "vs hier" && (statistic > 0 ? "+" : "-")}
				{statistic} %
			</Text>
			<Text style={{ color: "black" }}>{text}</Text>
		</View>
	);
};
