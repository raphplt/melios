import { ScrollView, View, Animated, Text } from "react-native";
import { League } from "../type/league";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getContrastingColor } from "@utils/colors";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";

interface LeagueBarProps {
	leagues: League[];
	currentLeagueId: string | undefined;
}

export const LeagueBar = ({ leagues, currentLeagueId }: LeagueBarProps) => {
	const { theme } = useTheme();
	const animatedValues = useRef(
		leagues.reduce((acc, league) => {
			acc[league.id] = {
				scale: new Animated.Value(currentLeagueId === league.id ? 1.1 : 1),
				opacity: new Animated.Value(currentLeagueId === league.id ? 1 : 0.6),
				glow: new Animated.Value(currentLeagueId === league.id ? 1 : 0),
			};
			return acc;
		}, {} as Record<string, { scale: Animated.Value; opacity: Animated.Value; glow: Animated.Value }>)
	).current;

	useEffect(() => {
		leagues.forEach((league) => {
			const isActive = currentLeagueId === league.id;
			const { scale, opacity, glow } = animatedValues[league.id];

			Animated.parallel([
				Animated.spring(scale, {
					toValue: isActive ? 1.15 : 1,
					useNativeDriver: true,
					tension: 100,
					friction: 8,
				}),
				Animated.timing(opacity, {
					toValue: isActive ? 1 : 0.6,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.loop(
					Animated.sequence([
						Animated.timing(glow, {
							toValue: isActive ? 1 : 0,
							duration: 1000,
							useNativeDriver: true,
						}),
						Animated.timing(glow, {
							toValue: isActive ? 0.7 : 0,
							duration: 1000,
							useNativeDriver: true,
						}),
					]),
					{ iterations: -1 }
				),
			]).start();
		});
	}, [currentLeagueId]);

	return (
		<View className="mb-6">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 16,
					paddingVertical: 12,
				}}
			>
				{leagues
					.sort((a, b) => a.rank - b.rank)
					.map((league, index) => {
						const { scale, opacity, glow } = animatedValues[league.id];
						const isActive = currentLeagueId === league.id;

						return (
							<Animated.View
								key={league.id}
								style={{
									transform: [{ scale }],
									opacity,
									marginHorizontal: 10,
								}}
							>
								<View className="items-center">
									{/* Glow effect for active league */}
									{isActive && (
										<Animated.View
											className="absolute w-20 h-20 rounded-full"
											style={{
												backgroundColor: league.color,
												opacity: glow.interpolate({
													inputRange: [0, 1],
													outputRange: [0.1, 0.3],
												}),
												transform: [{ scale: 1.2 }],
											}}
										/>
									)}

									{/* Main trophy container */}
									<View
										className="w-16 h-16 rounded-2xl items-center justify-center"
										style={{
											backgroundColor: theme.colors.cardBackground,
											shadowColor: league.color,
											shadowOffset: { width: 0, height: 6 },
											shadowOpacity: isActive ? 0.4 : 0.2,
											shadowRadius: isActive ? 12 : 6,
											elevation: isActive ? 10 : 6,
											borderWidth: 2,
											borderColor: isActive ? league.color : theme.colors.border,
										}}
									>
										<LinearGradient
											colors={[league.color, `${league.color}DD`]}
											className="w-14 h-14 rounded-xl items-center justify-center"
										>
											<MaterialCommunityIcons
												name="trophy"
												size={isActive ? 30 : 26}
												color={getContrastingColor(league.color)}
											/>
										</LinearGradient>
									</View>

									{/* League rank badge */}
									<View
										className="absolute -top-2 -right-2 w-7 h-7 rounded-full items-center justify-center"
										style={{
											backgroundColor: theme.colors.mythologyGold,
											borderWidth: 2,
											borderColor: theme.colors.background,
										}}
									>
										<Text
											className="text-xs font-bold"
											style={{
												color: theme.colors.textSecondary,
												fontFamily: theme.fonts.bold.fontFamily,
											}}
										>
											{league.rank}
										</Text>
									</View>

									{/* League name */}
									<Text
										className={`text-sm mt-3 font-medium text-center`}
										style={{
											color: isActive ? theme.colors.text : theme.colors.textTertiary,
											fontFamily: theme.fonts.medium.fontFamily,
											maxWidth: 80,
										}}
										numberOfLines={1}
									>
										{league.name}
									</Text>

									{/* Active indicator */}
									{isActive && (
										<View
											className="w-2 h-2 rounded-full mt-1"
											style={{ backgroundColor: league.color }}
										/>
									)}
								</View>
							</Animated.View>
						);
					})}
			</ScrollView>
		</View>
	);
};
