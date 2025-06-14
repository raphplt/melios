import React, { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { League } from "../type/league";
import { Member } from "../type/member";
import { LeagueDataValidator } from "../utils/LeagueDataValidator";

interface CurrentLeagueCardProps {
	league: League;
	member: Member;
	nextLeague?: League;
}

export const CurrentLeagueCard: React.FC<CurrentLeagueCardProps> = ({
	league,
	member,
	nextLeague,
}) => {
	const { theme } = useTheme();
	const pulseAnimation = useRef(new Animated.Value(1)).current;
	const progressAnimation = useRef(new Animated.Value(0)).current;
	const badgeAnimation = useRef(new Animated.Value(0)).current;

	const currentPoints = member.league?.points ?? 0;
	const weeklyPoints = member.league?.weeklyPoints ?? 0;
	// Points requis pour la prochaine ligue
	const pointsForNext = nextLeague?.pointsRequired ?? currentPoints;
	const progressPercentage = LeagueDataValidator.safePercentage(
		currentPoints,
		pointsForNext
	);

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnimation, {
					toValue: 1.05,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnimation, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				}),
			])
		).start();

		Animated.timing(progressAnimation, {
			toValue: progressPercentage,
			duration: 1500,
			useNativeDriver: false,
		}).start();

		Animated.spring(badgeAnimation, {
			toValue: 1,
			tension: 100,
			friction: 6,
			useNativeDriver: true,
		}).start();
	}, [progressPercentage]);

	const getLeagueIcon = (leagueName: string) => {
		const name = leagueName.toLowerCase();
		if (name.includes("terre") || name.includes("earth")) return "🌍";
		if (name.includes("bronze")) return "🟤";
		if (name.includes("fer") || name.includes("iron")) return "⚫";
		if (name.includes("argent") || name.includes("silver")) return "⚪";
		if (name.includes("or") || name.includes("gold")) return "🟡";
		if (name.includes("platine") || name.includes("platinum")) return "💎";
		if (name.includes("diamant") || name.includes("diamond")) return "💠";
		if (name.includes("maître") || name.includes("master")) return "👑";
		return "🏆";
	};

	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[`${league.color}15`, `${league.color}08`, "transparent"]}
				style={{
					borderWidth: 2,
					borderColor: league.color,
					backgroundColor: theme.colors.cardBackground,
					shadowColor: league.color,
					shadowOffset: { width: 0, height: 12 },
					shadowOpacity: 0.3,
					shadowRadius: 20,
					elevation: 15,
					borderRadius: 16,
					padding: 20,
				}}
			>
				{/* Header avec badge et nom */}
				<View className="flex-row items-center justify-between mb-6">
					<View className="flex-row items-center">
						<Animated.View
							style={{
								transform: [{ scale: badgeAnimation }],
							}}
							className="mr-4"
						>
							<View
								className="w-16 h-16 rounded-2xl items-center justify-center"
								style={{
									backgroundColor: league.color,
									shadowColor: league.color,
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.4,
									shadowRadius: 10,
									elevation: 8,
								}}
							>
								<Text className="text-3xl">{getLeagueIcon(league.name)}</Text>
							</View>

							{/* Badge de rang */}
							<View
								className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
								style={{
									backgroundColor: theme.colors.mythologyGold,
									borderWidth: 2,
									borderColor: theme.colors.background,
								}}
							>
								<Text
									className="text-sm font-bold"
									style={{
										color: theme.colors.text,
									}}
								>
									{league.rank}
								</Text>
							</View>
						</Animated.View>

						<View className="flex-1">
							<Text
								className="text-2xl font-bold mb-1"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{league.name}
							</Text>
							<View className="flex-row items-center">
								<View
									className="flex-row items-center"
									style={{
										backgroundColor: league.color,
										padding: 4,
										borderRadius: 999,
									}}
								>
									<MaterialCommunityIcons
										name="medal"
										size={14}
										color={theme.colors.mythologyGold}
									/>
								</View>
								<Text
									className="text-md ml-2"
									style={{
										color: theme.colors.textTertiary,
									}}
								>
									Rang #{league.rank}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Points actuels */}
				<View className="flex-row items-center justify-between mb-6">
					<Animated.View
						style={{
							transform: [{ scale: pulseAnimation }],
							backgroundColor: theme.colors.mythologyGold,
							borderRadius: 20,
							paddingHorizontal: 16,
							paddingVertical: 10,
							flexDirection: "row",
							alignItems: "center",
							shadowColor: theme.colors.mythologyGold,
							shadowOffset: { width: 0, height: 6 },
							shadowOpacity: 0.3,
							shadowRadius: 10,
							elevation: 8,
						}}
					>
						<MaterialCommunityIcons name="star" size={24} color={theme.colors.text} />
						<Text
							className="text-lg font-bold ml-2"
							style={{
								color: theme.colors.text,
							}}
						>
							{currentPoints} points
						</Text>
					</Animated.View>

					<View className="items-end">
						<Text
							className="text-sm"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							total • {weeklyPoints} cette semaine
						</Text>
					</View>
				</View>

				{/* Progression vers la prochaine ligue */}
				{nextLeague && (
					<View
						className="p-4 rounded-2xl"
						style={{ backgroundColor: theme.colors.backgroundSecondary }}
					>
						<View className="flex-row items-center justify-between mb-3">
							<Text
								className="text-md font-medium"
								style={{
									color: theme.colors.text,
								}}
							>
								Progression vers {nextLeague.name}
							</Text>
							<Text
								className="text-md font-bold"
								style={{
									color: nextLeague.color,
									// fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{pointsForNext - currentPoints} pts restants
							</Text>
						</View>

						{/* Barre de progression */}
						<View
							className="w-full h-3 rounded-full mb-2"
							style={{ backgroundColor: theme.colors.border }}
						>
							<Animated.View
								className="h-3 rounded-full"
								style={{
									width: progressAnimation.interpolate({
										inputRange: [0, 100],
										outputRange: ["0%", "100%"],
										extrapolate: "clamp",
									}),
									backgroundColor: nextLeague.color,
								}}
							/>
						</View>

						<View className="flex-row items-center justify-between">
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
								}}
							>
								{Math.round(progressPercentage)}% complété
							</Text>
							<View className="flex-row items-center">
								<Text className="text-lg mr-1">{getLeagueIcon(nextLeague.name)}</Text>
								<MaterialCommunityIcons
									name="arrow-right"
									size={16}
									color={nextLeague.color}
								/>
							</View>
						</View>
					</View>
				)}

				{/* Message d'encouragement */}
				<TouchableOpacity
					className="mt-4 p-3 rounded-xl flex-row items-center justify-center"
					style={{
						backgroundColor: `${league.color}20`,
						borderWidth: 1,
						borderColor: `${league.color}40`,
					}}
					activeOpacity={0.8}
				>
					<MaterialCommunityIcons
						name="trending-up"
						size={20}
						color={league.color}
					/>
					<Text
						className="text-sm font-semibold ml-2"
						style={{
							color: league.color,
						}}
					>
						{nextLeague
							? `Encore ${pointsForNext - currentPoints} points pour monter !`
							: "Vous êtes au sommet de l'Olympe !"}
					</Text>
				</TouchableOpacity>
			</LinearGradient>
		</View>
	);
};
