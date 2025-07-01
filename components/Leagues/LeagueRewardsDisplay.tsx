import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { League } from "../../type/league.d";
import { LeagueRewardService } from "../../services/LeagueRewardService";

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

	const leagueReward = LeagueRewardService.getLeagueRewardDescription(currentLeague);
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
				<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
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
							color: theme.colors.text,
							flex: 1,
						}}
					>
						{t("leagues.rewards.title")}
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

				{/* Multiplicateur principal */}
				<View style={{ 
					flexDirection: "row", 
					alignItems: "center", 
					justifyContent: "space-between",
					marginBottom: 12 
				}}>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontSize: 12,
								fontFamily: theme.fonts.medium.fontFamily,
								color: theme.colors.textTertiary,
								marginBottom: 2,
							}}
						>
							{t("leagues.rewards.multiplier_label")}
						</Text>
						<Text
							style={{
								fontSize: 18,
								fontFamily: theme.fonts.bold.fontFamily,
								color: getRewardColor(),
							}}
						>
							×{multiplier.toFixed(1)}
						</Text>
					</View>
					
					{/* Bonus quotidien */}
					{dailyBonus > 0 && (
						<View style={{ alignItems: "flex-end" }}>
							<Text
								style={{
									fontSize: 12,
									fontFamily: theme.fonts.medium.fontFamily,
									color: theme.colors.textTertiary,
									marginBottom: 2,
								}}
							>
								{t("leagues.rewards.daily_bonus")}
							</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text
									style={{
										fontSize: 16,
										fontFamily: theme.fonts.bold.fontFamily,
										color: theme.colors.orangePrimary,
										marginRight: 4,
									}}
								>
									+{dailyBonus}
								</Text>
								<MaterialCommunityIcons
									name="currency-usd"
									size={16}
									color={theme.colors.orangePrimary}
								/>
							</View>
						</View>
					)}
				</View>

				{/* Exemples de récompenses */}
				<View style={{
					backgroundColor: theme.colors.cardBackground,
					borderRadius: 12,
					padding: 12,
					marginBottom: 8,
				}}>
					<Text
						style={{
							fontSize: 11,
							fontFamily: theme.fonts.medium.fontFamily,
							color: theme.colors.textTertiary,
							marginBottom: 6,
						}}
					>
						{t("leagues.rewards.examples")}
					</Text>
					
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<View style={{ alignItems: "center" }}>
							<MaterialCommunityIcons
								name="check-circle"
								size={16}
								color={theme.colors.greenPrimary}
							/>
							<Text style={{ 
								fontSize: 10, 
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
								marginTop: 2,
								textAlign: "center"
							}}>
								{t("leagues.rewards.habit")}
							</Text>
							<Text style={{ 
								fontSize: 11, 
								color: getRewardColor(),
								fontFamily: theme.fonts.bold.fontFamily,
								marginTop: 1
							}}>
								{LeagueRewardService.calculateHabitCompletionReward(currentLeague, 1).totalReward}
							</Text>
						</View>
						
						<View style={{ alignItems: "center" }}>
							<MaterialCommunityIcons
								name="target"
								size={16}
								color={theme.colors.bluePrimary}
							/>
							<Text style={{ 
								fontSize: 10, 
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
								marginTop: 2,
								textAlign: "center"
							}}>
								{t("leagues.rewards.goal")}
							</Text>
							<Text style={{ 
								fontSize: 11, 
								color: getRewardColor(),
								fontFamily: theme.fonts.bold.fontFamily,
								marginTop: 1
							}}>
								{LeagueRewardService.calculateGoalCompletionReward(currentLeague, 50).totalReward}
							</Text>
						</View>
					</View>
				</View>

				{/* Message de motivation */}
				<Text
					style={{
						fontSize: 10,
						fontFamily: theme.fonts.regular.fontFamily,
						color: theme.colors.textTertiary,
						textAlign: "center",
						fontStyle: "italic",
					}}
				>
					{t("leagues.rewards.motivation_message")}
				</Text>
			</LinearGradient>
		</View>
	);
};
