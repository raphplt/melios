import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

interface LigueBadgeProgressionProps {
	currentBadge: string;
	currentRank: number;
	currentPoints: number;
	targetBadge?: string;
	targetPoints?: number;
	progressPercent: number;
}

export const LigueBadgeProgression: React.FC<LigueBadgeProgressionProps> = ({
	currentBadge,
	currentRank,
	currentPoints,
	targetBadge,
	targetPoints,
	progressPercent,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const getBadgeIcon = (badge: string) => {
		switch (badge.toLowerCase()) {
			case "fer":
			case "iron":
				return "medal";
			case "bronze":
				return "medal-outline";
			case "argent":
			case "silver":
				return "trophy-outline";
			case "or":
			case "gold":
				return "trophy";
			case "platine":
			case "platinum":
				return "crown-outline";
			case "diamant":
			case "diamond":
				return "diamond-stone";
			default:
				return "medal";
		}
	};
	const getBadgeColor = (badge: string) => {
		switch (badge.toLowerCase()) {
			case "fer":
			case "iron":
				return theme.colors.grayPrimary || "#B0B0B0";
			case "bronze":
				return "#CD7F32";
			case "argent":
			case "silver":
				return "#C0C0C0";
			case "or":
			case "gold":
				return theme.colors.mythologyGold || "#F4E4A6";
			case "platine":
			case "platinum":
				return "#E5E4E2";
			case "diamant":
			case "diamond":
				return "#B9F2FF";
			default:
				return theme.colors.grayPrimary || "#B0B0B0";
		}
	};

	const pointsRemaining = targetPoints ? targetPoints - currentPoints : 0;

	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[theme.colors.cardBackground, theme.colors.background]}
				style={{
					borderRadius: 24,
					padding: 24,
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.1,
					shadowRadius: 12,
					elevation: 8,
				}}
			>
				{/* Header avec badge actuel */}
				<View className="flex-row items-center mb-4">
					<View
						className="w-16 h-16 rounded-full items-center justify-center mr-4"
						style={{
							backgroundColor: getBadgeColor(currentBadge) + "20",
							borderWidth: 2,
							borderColor: getBadgeColor(currentBadge),
						}}
					>
						<MaterialCommunityIcons
							name={getBadgeIcon(currentBadge)}
							size={32}
							color={getBadgeColor(currentBadge)}
						/>
					</View>
					<View className="flex-1">
						<Text
							className="text-sm font-medium"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.medium.fontFamily,
							}}
						>
							{t("leagues.badge.current")}
						</Text>
						<Text
							className="text-xl font-bold"
							style={{
								color: theme.colors.text,
								fontFamily: theme.fonts.bold.fontFamily,
							}}
						>
							{currentBadge}
						</Text>
						<Text
							className="text-sm"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							{currentPoints} points
						</Text>
					</View>
					<View className="items-center">
						<Text
							className="text-2xl font-bold"
							style={{
								color: theme.colors.primary,
								fontFamily: theme.fonts.bold.fontFamily,
							}}
						>
							#{currentRank}
						</Text>
						<Text
							className="text-xs"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							Rang
						</Text>
					</View>
				</View>

				{/* Barre de progression */}
				{targetBadge && targetPoints ? (
					<>
						<View className="mb-3">
							<View className="flex-row justify-between items-center mb-2">
								<Text
									className="text-sm font-medium"
									style={{
										color: theme.colors.textTertiary,
										fontFamily: theme.fonts.medium.fontFamily,
									}}
								>
									{t("progress_towards")} {targetBadge}
								</Text>
								<Text
									className="text-sm font-bold"
									style={{
										color: theme.colors.primary,
										fontFamily: theme.fonts.bold.fontFamily,
									}}
								>
									{progressPercent}%
								</Text>
							</View>

							{/* Barre de progression */}
							<View
								className="h-3 rounded-full overflow-hidden"
								style={{
									backgroundColor: (theme.colors.grayPrimary || "#B0B0B0") + "30",
								}}
							>
								<LinearGradient
									colors={[
										theme.colors.primary || "#082099",
										theme.colors.secondary || "#87CEFA",
									]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={{
										height: "100%",
										borderRadius: 999,
										width: `${progressPercent}%`,
									}}
								/>
							</View>
						</View>
						{/* Message de progression */}
						<Text
							className="text-sm text-center font-medium"
							style={{
								color:
									pointsRemaining > 0
										? theme.colors.textTertiary || "#4E4E50"
										: theme.colors.greenPrimary || "#47A86C",
								fontFamily: theme.fonts.medium.fontFamily,
							}}
						>
							{pointsRemaining > 0
								? t("leagues.badge.progress_to_next", { points: pointsRemaining })
								: t("leagues.badge.promotion_achieved")}
						</Text>
					</>
				) : (
					<View className="items-center pt-4">
						<MaterialCommunityIcons
							name="crown"
							size={32}
							color={theme.colors.mythologyGold || "#F4E4A6"}
						/>
						<Text
							className="text-sm text-center font-medium mt-2"
							style={{
								color: theme.colors.mythologyGold || "#F4E4A6",
								fontFamily: theme.fonts.medium.fontFamily,
							}}
						>
							{t("leagues.badge.max_level")}
						</Text>
					</View>
				)}
			</LinearGradient>
		</View>
	);
};
