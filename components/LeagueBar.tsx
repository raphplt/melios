import { ScrollView, View, Animated, Text } from "react-native";
import { League } from "../type/league";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getContrastingColor } from "@utils/colors";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface LeagueBarProps {
	leagues: League[];
	currentLeagueId: string | undefined;
}

export const LeagueBar = ({ leagues, currentLeagueId }: LeagueBarProps) => {
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
					paddingVertical: 8,
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
									marginHorizontal: 8,
								}}
							>
								<View className="items-center">
									{/* Glow effect for active league */}
									{isActive && (
										<Animated.View
											className="absolute w-16 h-16 rounded-full"
											style={{
												backgroundColor: league.color,
												opacity: glow,
												transform: [{ scale: 1.3 }],
											}}
										/>
									)}

									{/* Main trophy container */}
									<View
										className="w-14 h-14 rounded-full items-center justify-center"
										style={{
											backgroundColor: `${league.color}20`, // Solid background for shadow
											shadowColor: league.color,
											shadowOffset: { width: 0, height: 4 },
											shadowOpacity: isActive ? 0.5 : 0.2,
											shadowRadius: isActive ? 8 : 4,
											elevation: isActive ? 8 : 4,
										}}
									>
										<LinearGradient
											colors={[league.color, `${league.color}CC`]}
											className="w-14 h-14 rounded-full items-center justify-center"
										>
											<MaterialCommunityIcons
												name="trophy"
												size={isActive ? 28 : 24}
												color={getContrastingColor(league.color)}
											/>
										</LinearGradient>
									</View>

									{/* League rank badge */}
									<View
										className="absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
										style={{ backgroundColor: "#FFD700" }}
									>
										<Text className="text-xs font-bold text-black">{league.rank}</Text>
									</View>

									{/* League name */}
									<Text
										className={`text-xs mt-2 font-medium ${
											isActive ? "text-white" : "text-gray-400"
										}`}
										numberOfLines={1}
									>
										{league.name}
									</Text>
								</View>
							</Animated.View>
						);
					})}
			</ScrollView>
		</View>
	);
};
