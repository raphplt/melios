import React from "react";
import { View, Text } from "react-native";
import Graph from "./Graph";

const ProgressionGraph = ({ habitLastDaysCompleted, activeButton, theme }) => {
	const getTitle = () => {
		switch (activeButton) {
			case "Jour":
				return "Complétion sur les dernières 24 heures";
			case "Semaine":
				return "Complétion sur les 7 derniers jours";
			case "Mois":
				return "Complétion sur les 30 derniers jours";
			case "Année":
				return "Complétion sur l'année écoulée";
			default:
				return "Complétion sur les 7 derniers jours";
		}
	};

	return (
		<View
			style={{ backgroundColor: theme.colors.background, alignItems: "center" }}
		>
			<Text
				className="w-10/12 mt-4 mb-2 text-[16px] font-semibold"
				style={{ color: theme.colors.text }}
			>
				{getTitle()}
			</Text>
			<Graph habits={habitLastDaysCompleted} period={activeButton} />
		</View>
	);
};

export default ProgressionGraph;
