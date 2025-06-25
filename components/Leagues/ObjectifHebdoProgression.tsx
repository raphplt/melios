import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { League } from "../../type/league.d";

interface ObjectifHebdoProgressionProps {
	currentPoints: number;
	targetPoints: number;
	daysLeft: number;
	currentLeague?: League | null;
}

export const ObjectifHebdoProgression: React.FC<
	ObjectifHebdoProgressionProps
> = ({ currentPoints, targetPoints, daysLeft, currentLeague }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const progressAnimation = useRef(new Animated.Value(0)).current;

	const isCompleted = currentPoints >= targetPoints;
	const progressPercent = Math.min((currentPoints / targetPoints) * 100, 100);
	const pointsRemaining = Math.max(targetPoints - currentPoints, 0);

	useEffect(() => {
		Animated.timing(progressAnimation, {
			toValue: progressPercent,
			duration: 1000,
			useNativeDriver: false,
		}).start();
	}, [progressPercent]);

	useEffect(() => {
		if (isCompleted) {
			Animated.sequence([
				Animated.timing(progressAnimation, {
					toValue: 105,
					duration: 200,
					useNativeDriver: false,
				}),
				Animated.timing(progressAnimation, {
					toValue: 100,
					duration: 200,
					useNativeDriver: false,
				}),
			]).start();
		}
	}, [isCompleted]);

	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[
					isCompleted ? theme.colors.greenSecondary : theme.colors.cardBackground,
					isCompleted ? theme.colors.greenPrimary + "20" : theme.colors.background,
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
									? theme.colors.greenPrimary + "20"
									: theme.colors.yellowPrimary + "20",
							}}
						>
							<MaterialCommunityIcons
								name={isCompleted ? "check-circle" : "target"}
								size={24}
								color={
									isCompleted ? theme.colors.greenPrimary : theme.colors.yellowPrimary
								}
							/>
						</View>
						<View className="flex-1">
							<View className="flex-row items-center">
								<Text
									className="text-lg font-bold mr-2"
									style={{
										color: theme.colors.text,
										fontFamily: theme.fonts.bold.fontFamily,
									}}
								>
									{t("leagues.weekly_goal.title")}
								</Text>
							</View>
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{t("days_left", { days: daysLeft })}
							</Text>
						</View>
					</View>

					{/* Points actuels */}
					<View className="items-end">
						<Text
							className="text-xl font-bold"
							style={{
								color: isCompleted ? theme.colors.greenPrimary : theme.colors.primary,
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
							backgroundColor: theme.colors.grayPrimary + "30",
						}}
					>
						<Animated.View
							style={{
								height: "100%",
								borderRadius: 999,
								width: progressAnimation.interpolate({
									inputRange: [0, 100],
									outputRange: ["0%", "100%"],
									extrapolate: "clamp",
								}),
								backgroundColor: isCompleted
									? theme.colors.greenPrimary
									: theme.colors.yellowPrimary,
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
							isCompleted ? theme.colors.greenPrimary : theme.colors.yellowPrimary
						}
						style={{ marginRight: 8 }}
					/>
					<Text
						className="text-sm font-medium text-center"
						style={{
							color: isCompleted
								? theme.colors.greenPrimary
								: theme.colors.yellowPrimary,
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
