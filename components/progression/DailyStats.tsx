import React from "react";
import { View, Text } from "react-native";
import { HabitCard } from "./HabitCard";
import { Iconify } from "react-native-iconify";
import HeaderContainer from "./HeaderContainer";

const DailyStats = ({
	scoreHabits,
	comparedToYesterday,
	theme,
}: {
	scoreHabits: number;
	comparedToYesterday: number;
	theme: any;
}) => {
	return (
		<View
			style={{ backgroundColor: theme.colors.background, alignItems: "center" }}
		>
			<HeaderContainer>
				<Iconify icon="ph:sun-bold" size={20} color={theme.colors.text} />
				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] font-semibold"
				>
					Statistiques du jour
				</Text>
			</HeaderContainer>
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
