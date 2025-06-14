import { View, Text, Animated } from "react-native";
import { League } from "../type/league";
import { Member } from "../type/member";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useTheme } from "@context/ThemeContext";

interface CurrentLeagueProps {
	league: League;
	member: Member;
}

export const CurrentLeague = ({ league, member }: CurrentLeagueProps) => {
	const { theme } = useTheme();
	const shimmerAnimation = useRef(new Animated.Value(0)).current;
	const pulseAnimation = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnimation, {
					toValue: 1,
					duration: 2000,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnimation, {
					toValue: 0,
					duration: 2000,
					useNativeDriver: true,
				}),
			])
		).start();

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
	}, []);

	const shimmerTranslate = shimmerAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 100],
	});

	return (
		<View className="mx-4 mb-6">
			<View
				className="rounded-3xl border-2 overflow-hidden"
				style={{
					borderColor: league.color,
					backgroundColor: theme.colors.cardBackground,
					shadowColor: league.color,
					shadowOffset: { width: 0, height: 12 },
					shadowOpacity: 0.25,
					shadowRadius: 16,
					elevation: 12,
				}}
			>
				<LinearGradient
					colors={[`${league.color}15`, `${league.color}08`, "transparent"]}
					className="p-6"
				>
					{/* Shimmer overlay */}
					<Animated.View
						className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl overflow-hidden"
						style={{ opacity: 0.1 }}
					>
						<Animated.View
							className="w-20 h-full"
							style={{
								backgroundColor: theme.colors.textSecondary,
								transform: [{ translateX: shimmerTranslate }],
								opacity: 0.2,
							}}
						/>
					</Animated.View>

					<View className="flex-row items-center">
						{/* Trophy with gradient background */}
						<View className="mr-6">
							<View
								className="w-18 h-18 rounded-3xl items-center justify-center"
								style={{
									backgroundColor: theme.colors.background,
									shadowColor: league.color,
									shadowOffset: { width: 0, height: 6 },
									shadowOpacity: 0.3,
									shadowRadius: 10,
									elevation: 8,
									borderWidth: 2,
									borderColor: `${league.color}40`,
								}}
							>
								<LinearGradient
									colors={[league.color, `${league.color}DD`]}
									className="w-16 h-16 rounded-2xl items-center justify-center"
								>
									<MaterialCommunityIcons name="trophy" size={36} color="white" />
								</LinearGradient>
							</View>

							{/* Rank badge */}
							<View
								className="absolute -top-2 -right-2 w-9 h-9 rounded-full items-center justify-center"
								style={{
									backgroundColor: theme.colors.mythologyGold,
									borderWidth: 2,
									borderColor: theme.colors.background,
								}}
							>
								<Text
									className="text-sm font-bold"
									style={{
										color: theme.colors.textSecondary,
										fontFamily: theme.fonts.bold.fontFamily,
									}}
								>
									{league.rank}
								</Text>
							</View>
						</View>

						{/* League info */}
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

							<View className="flex-row items-center mb-4">
								<MaterialCommunityIcons
									name="medal"
									size={18}
									color={theme.colors.mythologyGold}
								/>
								<Text
									className="text-base ml-2"
									style={{
										color: theme.colors.textTertiary,
										fontFamily: theme.fonts.medium.fontFamily,
									}}
								>
									Rang {league.rank}
								</Text>
							</View>

							{/* Points with animation */}
							<Animated.View
								style={{
									transform: [{ scale: pulseAnimation }],
									backgroundColor: theme.colors.mythologyGold,
									borderRadius: 16,
									paddingHorizontal: 16,
									paddingVertical: 10,
									alignSelf: "flex-start",
									shadowColor: theme.colors.mythologyGold,
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.3,
									shadowRadius: 8,
									elevation: 6,
								}}
							>
								<View className="flex-row items-center">
									<MaterialCommunityIcons
										name="star"
										size={20}
										color={theme.colors.textSecondary}
									/>
									<Text
										className="text-lg font-bold ml-2"
										style={{
											color: theme.colors.textSecondary,
											fontFamily: theme.fonts.bold.fontFamily,
										}}
									>
										{member.league?.points ?? 0} points
									</Text>
								</View>
								<Text
									className="text-xs opacity-80"
									style={{
										color: theme.colors.textSecondary,
										fontFamily: theme.fonts.regular.fontFamily,
									}}
								>
									cette semaine
								</Text>
							</Animated.View>
						</View>
					</View>

					{/* Progress indicator */}
					<View
						className="mt-6 pt-4 border-t"
						style={{ borderColor: theme.colors.border }}
					>
						<View className="flex-row justify-between items-center">
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.medium.fontFamily,
								}}
							>
								Progression Divine
							</Text>
							<Text
								className="text-sm font-bold"
								style={{
									color: theme.colors.mythologyGold,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								+{member.league?.points ?? 0} pts
							</Text>
						</View>
						<View
							className="w-full h-3 rounded-full mt-3"
							style={{ backgroundColor: theme.colors.backgroundSecondary }}
						>
							<LinearGradient
								colors={[
									theme.colors.mythologyGold || "#F4E4A6",
									theme.colors.orangePrimary,
								]}
								className="h-3 rounded-full"
								style={{
									width: `${Math.min(((member.league?.points ?? 0) / 100) * 100, 100)}%`,
								}}
							/>
						</View>
					</View>
				</LinearGradient>
			</View>
		</View>
	);
};
