import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getBonusMission } from "@constants/extendedDailyTasks";

interface ActionFooterProps {
	canClaimReward: boolean;
	onClaimReward: () => void;
	rewardClaimed: boolean;
}

const ActionFooter: React.FC<ActionFooterProps> = ({
	canClaimReward,
	onClaimReward,
	rewardClaimed,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const navigateToRewards = () => {
		// Navigation vers l'écran des récompenses (à adapter selon votre routing)
		// router.push("/rewards");
	};

	const suggestBonusMission = () => {
		const bonusMission = getBonusMission();
		if (bonusMission) {
			Alert.alert(
				t("bonus_mission") || "Mission bonus",
				`${t(bonusMission.slug) || bonusMission.text}\n\n${
					t(bonusMission.slug + "_desc") || bonusMission.description || ""
				}\n\n🎁 Récompense: +${bonusMission.xpReward} XP`,
				[
					{
						text: t("cancel") || "Annuler",
						style: "cancel",
					},
					{
						text: t("accept") || "Accepter",
						onPress: () => {
							// Ici on pourrait ajouter la mission bonus aux tâches actuelles
							// ou naviguer vers un écran spécifique
							Alert.alert(
								t("mission_accepted") || "Mission acceptée !",
								t("mission_added_to_list") || "La mission a été ajoutée à ta liste."
							);
						},
					},
				]
			);
		} else {
			Alert.alert(
				t("no_bonus_mission") || "Aucune mission bonus",
				t("no_bonus_mission_available") ||
					"Aucune mission bonus n'est disponible pour le moment."
			);
		}
	};

	if (rewardClaimed) {
		return (
			<View className="px-6 py-4">
				<View className="flex-row gap-3">
					<TouchableOpacity
						onPress={navigateToRewards}
						className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
						style={{ backgroundColor: theme.colors.primary }}
					>
						<Ionicons
							name="gift"
							size={20}
							color={theme.colors.textSecondary}
							style={{ marginRight: 8 }}
						/>
						<Text
							className="text-base font-bold"
							style={{
								color: theme.colors.textSecondary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("view_rewards") || "Mes récompenses"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={suggestBonusMission}
						className="flex-1 rounded-2xl p-4 flex-row items-center justify-center"
						style={{
							backgroundColor: theme.colors.cardBackground,
							borderWidth: 2,
							borderColor: theme.colors.primary,
						}}
					>
						<Ionicons
							name="add-circle"
							size={20}
							color={theme.colors.primary}
							style={{ marginRight: 8 }}
						/>
						<Text
							className="text-base font-bold"
							style={{
								color: theme.colors.primary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("bonus_mission") || "Mission bonus"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View className="px-6 py-4">
			{canClaimReward ? (
				<TouchableOpacity
					onPress={onClaimReward}
					className="rounded-2xl p-4 items-center"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<View className="flex-row items-center">
						<Ionicons
							name="trophy"
							size={24}
							color={theme.colors.textSecondary}
							style={{ marginRight: 12 }}
						/>
						<Text
							className="text-lg font-bold"
							style={{
								color: theme.colors.textSecondary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("claim_reward") || "Récupérer ma récompense"}
						</Text>
					</View>
				</TouchableOpacity>
			) : (
				<View className="items-center">
					<Text
						className="text-base text-center mb-4"
						style={{
							color: theme.colors.textTertiary,
							fontFamily: "Baskerville",
						}}
					>
						{t("complete_missions_hint") ||
							"Complete tes missions pour débloquer ta récompense !"}
					</Text>

					<TouchableOpacity
						onPress={suggestBonusMission}
						className="rounded-2xl px-6 py-3 flex-row items-center"
						style={{
							backgroundColor: theme.colors.cardBackground,
							borderWidth: 1,
							borderColor: theme.colors.border,
						}}
					>
						<Ionicons
							name="bulb"
							size={18}
							color={theme.colors.primary}
							style={{ marginRight: 8 }}
						/>
						<Text
							className="text-sm font-semibold"
							style={{
								color: theme.colors.primary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("get_bonus_mission") || "Faire une mission bonus"}
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ActionFooter;
