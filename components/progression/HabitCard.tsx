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
				setFillColor("#C54922");
			}
			if (25 < statistic && statistic <= 50) {
				setFillColor("#FFD31A");
			}
			if (50 < statistic && statistic <= 75) {
				setFillColor("#9DF1BA");
			}
			if (75 < statistic && statistic <= 100) {
				setFillColor("#22C55E");
			}
		} else if (text == "vs hier") {
			if (statistic > 0) {
				setFillColorLastDays("#9DF1BA");
			} else setFillColorLastDays("#C54922");
		}
	}, [statistic]);

	return (
		<View
			style={{
				backgroundColor: fillColorLastDays || theme.colors.backgroundSecondary,
				borderWidth: 1,
				borderColor: theme.colors.border,
			}}
			className="flex items-center justify-center w-36 h-36 rounded-lg mx-auto mt-5"
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
			<Text style={{ color: theme.colors.text }} className="text-3xl mt-1">
				{text == "vs hier" && (statistic > 0 ? "+" : "-")}
				{statistic} %
			</Text>
			<Text style={{ color: theme.colors.text }}>{text}</Text>
		</View>
	);
};
