import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { League } from "../type/league";
import { Member } from "../type/member";
import { LeagueDataValidator } from "../utils/LeagueDataValidator";

interface PersonalProgressCardProps {
	league: League;
	member: Member;
	nextLeague?: League;
}

export const PersonalProgressCard: React.FC<PersonalProgressCardProps> = ({
	league,
	member,
	nextLeague,
}) => {
	const { theme } = useTheme();

	const validatedLeague = LeagueDataValidator.validateLeagueData(member.league);
	const currentPoints = validatedLeague?.points ?? 0;
	const weeklyPoints = validatedLeague?.weeklyPoints ?? 0;
	const pointsForNext = nextLeague?.pointsRequired ?? currentPoints;

	const progressPercentage = LeagueDataValidator.safePercentage(
		currentPoints,
		pointsForNext
	);
	const weeklyRequirement = league.weeklyPointsRequired ?? 50;
	const weeklyProgress = LeagueDataValidator.safePercentage(
		weeklyPoints,
		weeklyRequirement
	);

	const lastReset = new Date(validatedLeague?.lastWeeklyReset || new Date());
	const now = new Date();
	const daysSinceReset = Math.floor(
		(now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
	);
	const daysUntilReset = Math.max(0, 7 - daysSinceReset);

	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
				style={{
					shadowColor: league.color,
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.15,
					shadowRadius: 12,
					elevation: 8,
					borderWidth: 1,
					borderColor: `${league.color}20`,
					borderRadius: 20,
					padding: 16,
				}}
			>
				<Text
					className="text-xl font-bold mb-4"
					style={{
						color: theme.colors.text,
					}}
				>
					Ma Progression Personnelle
				</Text>

				{/* Progression hebdomadaire */}
				<View className="mb-6">
					<View className="flex-row items-center justify-between mb-2">
						<Text
							className="text-base font-medium"
							style={{
								color: theme.colors.text,
							}}
						>
							Objectif Hebdomadaire
						</Text>
						<Text
							className="text-sm"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							{daysUntilReset} jour{daysUntilReset !== 1 ? "s" : ""} restant
							{daysUntilReset !== 1 ? "s" : ""}
						</Text>
					</View>

					<View className="flex-row items-center justify-between mb-2">
						<Text
							className="text-sm"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							{LeagueDataValidator.formatPoints(weeklyPoints)} /{" "}
							{LeagueDataValidator.formatPoints(weeklyRequirement)} points
						</Text>
						<Text
							className="text-sm font-bold"
							style={{
								color:
									weeklyProgress >= 100
										? theme.colors.textTertiary || "#00C853"
										: theme.colors.textTertiary,
							}}
						>
							{Math.round(weeklyProgress)}%
						</Text>
					</View>

					<View
						className="w-full h-3 rounded-full"
						style={{ backgroundColor: theme.colors.border }}
					>
						<View
							className="h-3 rounded-full"
							style={{
								width: `${weeklyProgress}%`,
								backgroundColor:
									weeklyProgress >= 100
										? theme.colors.primary || "#00C853"
										: league.color,
							}}
						/>
					</View>

					{weeklyProgress >= 100 && (
						<View className="flex-row items-center mt-2">
							<MaterialCommunityIcons
								name="check-circle"
								size={16}
								color={theme.colors.primary || "#00C853"}
							/>
							<Text
								className="text-sm ml-1"
								style={{
									color: theme.colors.primary || "#00C853",
								}}
							>
								Objectif hebdomadaire atteint !
							</Text>
						</View>
					)}
				</View>

				{/* Progression vers la prochaine ligue */}
				{nextLeague && (
					<View>
						<View className="flex-row items-center justify-between mb-2">
							<Text
								className="text-base font-medium"
								style={{
									color: theme.colors.text,
								}}
							>
								Progression vers {nextLeague.name}
							</Text>
							<Text
								className="text-sm font-bold"
								style={{
									color: nextLeague.color,
								}}
							>
								{LeagueDataValidator.formatPoints(pointsForNext - currentPoints)} pts
								restants
							</Text>
						</View>

						<View className="flex-row items-center justify-between mb-2">
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
									// fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{LeagueDataValidator.formatPoints(currentPoints)} /{" "}
								{LeagueDataValidator.formatPoints(pointsForNext)} points
							</Text>
							<Text
								className="text-sm font-bold"
								style={{
									color: theme.colors.text,
									// fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{Math.round(progressPercentage)}%
							</Text>
						</View>

						<View
							className="w-full h-3 rounded-full"
							style={{ backgroundColor: theme.colors.border }}
						>
							<View
								className="h-3 rounded-full"
								style={{
									width: `${progressPercentage}%`,
									backgroundColor: nextLeague.color,
								}}
							/>
						</View>
					</View>
				)}

				{/* Message si pas de ligue suivante */}
				{!nextLeague && (
					<View className="items-center p-4">
						<MaterialCommunityIcons
							name="crown"
							size={32}
							color={theme.colors.mythologyGold}
						/>
						<Text
							className="text-lg font-bold mt-2 text-center"
							style={{
								color: theme.colors.mythologyGold,
								fontFamily: theme.fonts.bold.fontFamily,
							}}
						>
							Niveau Maximum Atteint !
						</Text>
						<Text
							className="text-sm mt-1 text-center"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							Vous êtes un maître légendaire !
						</Text>
					</View>
				)}
			</LinearGradient>
		</View>
	);
};
