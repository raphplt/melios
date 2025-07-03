import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { League } from "../../type/league.d";
import { LeagueRewardService } from "../../services/LeagueRewardService";
import MoneyMelios from "@components/Svg/MoneyMelios";

interface LeagueRewardsDisplayProps {
	currentLeague: League | null;
	onInfoPress?: () => void;
}

export const LeagueRewardsDisplay: React.FC<LeagueRewardsDisplayProps> = ({
	currentLeague,
	onInfoPress,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	if (!currentLeague) return null;

	const leagueReward =
		LeagueRewardService.getLeagueRewardDescription(currentLeague);
	const multiplier = leagueReward.multiplier;
	const dailyBonus = leagueReward.meliosPoints;

	// Couleurs graduelles selon le multiplicateur
	const getRewardColor = () => {
		if (multiplier >= 3) return theme.colors.mythologyGold;
		if (multiplier >= 2.5) return theme.colors.purplePrimary;
		if (multiplier >= 2) return theme.colors.bluePrimary;
		if (multiplier >= 1.5) return theme.colors.greenPrimary;
		return theme.colors.primary;
	};

	const getRewardGradient = (): [string, string] => {
		const color = getRewardColor();
		return [color + "20", color + "10"];
	};

	return (
		<View style={{ marginHorizontal: 16, marginBottom: 16 }}>
			<LinearGradient
				colors={getRewardGradient()}
				style={{
					borderRadius: 16,
					padding: 16,
					borderWidth: 1,
					borderColor: getRewardColor() + "30",
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 4,
				}}
			>
				{/* Header */}
				<View
					style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
				>
					<MaterialCommunityIcons
						name="star-circle"
						size={20}
						color={getRewardColor()}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={{
							fontSize: 14,
							fontFamily: theme.fonts.bold.fontFamily,
							color: theme.colors.textSecondary,
							flex: 1,
						}}
					>
						🎯 Avantages de votre ligue
					</Text>
					<TouchableOpacity
						onPress={onInfoPress}
						style={{
							backgroundColor: getRewardColor() + "20",
							borderRadius: 12,
							padding: 6,
						}}
					>
						<MaterialCommunityIcons
							name="information"
							size={16}
							color={getRewardColor()}
						/>
					</TouchableOpacity>
				</View>

				{/* Gains quotidiens */}
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderRadius: 12,
						padding: 12,
						marginBottom: 12,
					}}
				>
					<Text
						style={{
							fontSize: 12,
							fontFamily: theme.fonts.bold.fontFamily,
							color: theme.colors.text,
							marginBottom: 8,
						}}
					>
						💰 Gains quotidiens possibles
					</Text>

					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<View style={{ alignItems: "center", flex: 1 }}>
							<MaterialCommunityIcons
								name="check-circle"
								size={20}
								color={theme.colors.greenPrimary}
							/>
							<Text
								style={{
									fontSize: 10,
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
									marginTop: 2,
									textAlign: "center",
								}}
							>
								1 habitude
							</Text>
							<View
								style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
							>
								<Text
									style={{
										fontSize: 12,
										color: getRewardColor(),
										fontFamily: theme.fonts.bold.fontFamily,
										marginRight: 2,
									}}
								>
									+
									{
										LeagueRewardService.calculateHabitCompletionReward(currentLeague, 1)
											.totalReward
									}
								</Text>
								<MoneyMelios width={12} height={12} />
							</View>
						</View>

						<View style={{ alignItems: "center", flex: 1 }}>
							<MaterialCommunityIcons
								name="target"
								size={20}
								color={theme.colors.bluePrimary}
							/>
							<Text
								style={{
									fontSize: 10,
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
									marginTop: 2,
									textAlign: "center",
								}}
							>
								1 objectif
							</Text>
							<View
								style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
							>
								<Text
									style={{
										fontSize: 12,
										color: getRewardColor(),
										fontFamily: theme.fonts.bold.fontFamily,
										marginRight: 2,
									}}
								>
									+
									{
										LeagueRewardService.calculateGoalCompletionReward(currentLeague, 50)
											.totalReward
									}
								</Text>
								<MoneyMelios width={12} height={12} />
							</View>
						</View>

						{dailyBonus > 0 && (
							<View style={{ alignItems: "center", flex: 1 }}>
								<MaterialCommunityIcons
									name="gift"
									size={20}
									color={theme.colors.yellowPrimary}
								/>
								<Text
									style={{
										fontSize: 10,
										color: theme.colors.textTertiary,
										fontFamily: theme.fonts.regular.fontFamily,
										marginTop: 2,
										textAlign: "center",
									}}
								>
									Bonus quotidien
								</Text>
								<View
									style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
								>
									<Text
										style={{
											fontSize: 12,
											color: theme.colors.yellowPrimary,
											fontFamily: theme.fonts.bold.fontFamily,
											marginRight: 2,
										}}
									>
										+{dailyBonus}
									</Text>
									<MoneyMelios width={12} height={12} />
								</View>
							</View>
						)}
					</View>
				</View>

				{/* Multiplicateur de ligue */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: getRewardColor() + "15",
						borderRadius: 8,
						padding: 8,
						marginBottom: 8,
					}}
				>
					<MaterialCommunityIcons
						name="trophy"
						size={16}
						color={theme.colors.textSecondary}
						style={{ marginRight: 6 }}
					/>
					<Text
						style={{
							fontSize: 12,
							fontFamily: theme.fonts.medium.fontFamily,
							color: theme.colors.textSecondary,
							marginRight: 4,
						}}
					>
						Multiplicateur de ligue:
					</Text>
					<Text
						style={{
							fontSize: 14,
							fontFamily: theme.fonts.bold.fontFamily,
							color: theme.colors.textSecondary,
						}}
					>
						×{multiplier.toFixed(1)}
					</Text>
				</View>

				{/* Message de motivation */}
				<Text
					style={{
						fontSize: 10,
						fontFamily: theme.fonts.regular.fontFamily,
						color: theme.colors.textSecondary,
						textAlign: "center",
						fontStyle: "italic",
					}}
				>
					Plus votre ligue est élevée, plus vous gagnez de points Melios !
				</Text>
			</LinearGradient>
		</View>
	);
};
