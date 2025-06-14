import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import ButtonClose from "@components/Shared/ButtonClose";

interface MotivationHeaderProps {
	rewardClaimed: boolean;
}

const MotivationHeader: React.FC<MotivationHeaderProps> = ({
	rewardClaimed,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<View
			className="py-6 px-6 pt-4"
			style={{ backgroundColor: theme.colors.backgroundTertiary }}
		>
			<ButtonClose />
			<View className="flex-row items-center justify-between">
				<View className="flex-1 mr-4">
					<Text
						className="text-2xl mb-2"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{rewardClaimed
							? t("daily_rewards_completed") || "Missions accomplies !"
							: t("daily_rewards") || "Récompenses quotidiennes"}
					</Text>
					<Text
						className="text-sm opacity-80"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{rewardClaimed
							? t("motivation_completed") || "Excellent travail aujourd'hui !"
							: t("motivation_text") ||
							  "Chaque petite action te rapproche de ton objectif !"}
					</Text>
				</View>
				<View
					className="p-3 rounded-full"
					style={{ backgroundColor: theme.colors.primary + "20" }}
				>
					<Ionicons
						name={rewardClaimed ? "trophy" : "flame"}
						size={28}
						color={theme.colors.textSecondary}
					/>
				</View>
			</View>
		</View>
	);
};

export default MotivationHeader;
