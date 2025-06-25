import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

interface ObjectifHebdoProgressionProps {
	currentPoints: number;
	targetPoints: number;
	daysLeft: number;
}

export const ObjectifHebdoProgression: React.FC<
	ObjectifHebdoProgressionProps
> = ({ currentPoints, targetPoints, daysLeft }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const isCompleted = currentPoints >= targetPoints;
	const progressPercent = Math.min((currentPoints / targetPoints) * 100, 100);
	const pointsRemaining = Math.max(targetPoints - currentPoints, 0);

	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[
					isCompleted
						? theme.colors.greenSecondary || "#CDEAD6"
						: theme.colors.cardBackground || "#F6F6F6",
					isCompleted
						? (theme.colors.greenPrimary || "#47A86C") + "20"
						: theme.colors.background || "#ffffff",
				]}
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
				{/* Header */}
				<View className="flex-row items-center justify-between mb-4">
					<View className="flex-row items-center">
						<View
							className="w-12 h-12 rounded-full items-center justify-center mr-3"
							style={{
								backgroundColor: isCompleted
									? (theme.colors.greenPrimary || "#47A86C") + "20"
									: (theme.colors.yellowPrimary || "#D1A916") + "20",
							}}
						>
							<MaterialCommunityIcons
								name={isCompleted ? "check-circle" : "target"}
								size={24}
								color={
									isCompleted
										? theme.colors.greenPrimary || "#47A86C"
										: theme.colors.yellowPrimary || "#D1A916"
								}
							/>
						</View>
						<View>
							<Text
								className="text-lg font-bold"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{t("leagues.weekly_goal.title")}
							</Text>
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{daysLeft === 1
									? t("leagues.weekly_goal.days_left_one", { count: daysLeft })
									: t("leagues.weekly_goal.days_left_other", { count: daysLeft })}
							</Text>
						</View>
					</View>

					{/* Points actuels */}
					<View className="items-end">
						<Text
							className="text-xl font-bold"
							style={{
								color: isCompleted
									? theme.colors.greenPrimary || "#47A86C"
									: theme.colors.primary || "#082099",
								fontFamily: theme.fonts.bold.fontFamily,
							}}
						>
							{currentPoints}
						</Text>
						<Text
							className="text-xs"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							/ {targetPoints}
						</Text>
					</View>
				</View>

				{/* Barre de progression */}
				<View className="mb-4">
					<View
						className="h-2 rounded-full overflow-hidden"
						style={{
							backgroundColor: (theme.colors.grayPrimary || "#B0B0B0") + "30",
						}}
					>
						<LinearGradient
							colors={
								isCompleted
									? [
											theme.colors.greenPrimary || "#47A86C",
											theme.colors.greenSecondary || "#CDEAD6",
									  ]
									: [
											theme.colors.yellowPrimary || "#D1A916",
											theme.colors.yellowSecondary || "#FFF4C2",
									  ]
							}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={{
								height: "100%",
								borderRadius: 999,
								width: `${progressPercent}%`,
							}}
						/>
					</View>

					<View className="flex-row justify-between mt-2">
						<Text
							className="text-xs"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							{Math.round(progressPercent)}%
						</Text>
						<Text
							className="text-xs"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							{targetPoints} pts
						</Text>
					</View>
				</View>

				{/* Message de statut */}
				<View className="flex-row items-center justify-center">
					<MaterialCommunityIcons
						name={isCompleted ? "check" : "information"}
						size={16}
						color={
							isCompleted
								? theme.colors.greenPrimary || "#47A86C"
								: theme.colors.yellowPrimary || "#D1A916"
						}
						style={{ marginRight: 8 }}
					/>
					<Text
						className="text-sm font-medium text-center"
						style={{
							color: isCompleted
								? theme.colors.greenPrimary || "#47A86C"
								: theme.colors.yellowPrimary || "#D1A916",
							fontFamily: theme.fonts.medium.fontFamily,
						}}
					>
						{isCompleted
							? t("leagues.weekly_goal.completed")
							: t("leagues.weekly_goal.remaining", { points: pointsRemaining })}
					</Text>
				</View>
			</LinearGradient>
		</View>
	);
};
