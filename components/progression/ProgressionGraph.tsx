import React from "react";
import { View, Text } from "react-native";
import Graph from "./Graph";
import { Iconify } from "react-native-iconify";
import HeaderContainer from "./HeaderContainer";

const ProgressionGraph = ({
	habitLastDaysCompleted,
	activeButton,
	theme,
}: {
	habitLastDaysCompleted: Record<string, number>;
	activeButton: string;
	theme: any;
}) => {
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
			<HeaderContainer>
				<Iconify icon="mdi:graph-line" size={20} color={theme.colors.text} />
				<Text
					className="text-[16px] font-semibold"
					style={{ color: theme.colors.text }}
				>
					{getTitle()}
				</Text>
			</HeaderContainer>

			<Graph habits={habitLastDaysCompleted} period={activeButton} />
		</View>
	);
};

export default ProgressionGraph;
