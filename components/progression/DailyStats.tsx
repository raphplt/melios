import React from "react";
import { View, Text } from "react-native";
import HabitCard from "../../components/progression/HabitCard";

const DailyStats = ({ scoreHabits, comparedToYesterday, theme }) => {
	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				style={{ color: theme.colors.text }}
				className=" w-10/12 mx-auto mt-4 text-[16px] font-semibold mb-2"
			>
				Statistiques du jour
			</Text>
			<View
				className="flex items-center justify-between flex-row mb-3 w-[90%] mx-auto mt-2"
				style={{ backgroundColor: theme.colors.background }}
			>
				<HabitCard statistic={scoreHabits} text="complétées" theme={theme} />
				<HabitCard statistic={comparedToYesterday} text="vs hier" theme={theme} />
			</View>
		</View>
	);
};

export default DailyStats;
