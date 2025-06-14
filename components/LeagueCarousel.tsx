import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	Animated,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { League } from "../type/league";

interface LeagueCarouselProps {
	leagues: League[];
	currentLeagueId: string | undefined;
	onLeaguePress?: (league: League) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = 160;
const CARD_SPACING = 16;

export const LeagueCarousel: React.FC<LeagueCarouselProps> = ({
	leagues,
	currentLeagueId,
	onLeaguePress,
}) => {
	const { theme } = useTheme();
	const scrollViewRef = useRef<ScrollView>(null);
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

	const animatedValues = useRef(
		leagues.reduce((acc, league) => {
			acc[league.id] = {
				scale: new Animated.Value(currentLeagueId === league.id ? 1 : 0.95),
				opacity: new Animated.Value(currentLeagueId === league.id ? 1 : 0.7),
				glow: new Animated.Value(0),
			};
			return acc;
		}, {} as Record<string, { scale: Animated.Value; opacity: Animated.Value; glow: Animated.Value }>)
	).current;

	const sortedLeagues = leagues.sort((a, b) => a.rank - b.rank);

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const contentOffsetX = event.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / (CARD_WIDTH + CARD_SPACING));
		setCurrentScrollIndex(
			Math.max(0, Math.min(currentIndex, sortedLeagues.length - 1))
		);
	};

	useEffect(() => {
		const currentLeagueIndex = sortedLeagues.findIndex(
			(league) => league.id === currentLeagueId
		);

		if (currentLeagueIndex >= 0 && scrollViewRef.current) {
			setTimeout(() => {
				scrollViewRef.current?.scrollTo({
					x: currentLeagueIndex * (CARD_WIDTH + CARD_SPACING),
					animated: true,
				});
				setCurrentScrollIndex(currentLeagueIndex);
			}, 100);
		}
	}, [currentLeagueId, sortedLeagues]);

	useEffect(() => {
		leagues.forEach((league) => {
			const isActive = currentLeagueId === league.id;
			const { scale, opacity, glow } = animatedValues[league.id];

			Animated.parallel([
				Animated.spring(scale, {
					toValue: isActive ? 1 : 0.95,
					useNativeDriver: true,
					tension: 100,
					friction: 8,
				}),
				Animated.timing(opacity, {
					toValue: isActive ? 1 : 0.7,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			if (isActive) {
				Animated.loop(
					Animated.sequence([
						Animated.timing(glow, {
							toValue: 1,
							duration: 1500,
							useNativeDriver: true,
						}),
						Animated.timing(glow, {
							toValue: 0.3,
							duration: 1500,
							useNativeDriver: true,
						}),
					])
				).start();
			} else {
				glow.setValue(0);
			}
		});
	}, [currentLeagueId, leagues]);

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

	const getLeagueGradient = (league: League): [string, string, string] => {
		return [`${league.color}E6`, `${league.color}B3`, `${league.color}66`];
	};

	return (
		<View className="mb-6">
			<ScrollView
				ref={scrollViewRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				decelerationRate="fast"
				snapToInterval={CARD_WIDTH + CARD_SPACING}
				snapToAlignment="start"
				onScroll={handleScroll}
				scrollEventThrottle={16}
				contentContainerStyle={{
					paddingHorizontal: CARD_SPACING,
				}}
				className="py-4"
			>
				{sortedLeagues.map((league, index) => {
					const { scale, opacity, glow } = animatedValues[league.id];
					const isActive = currentLeagueId === league.id;
					const currentIndex = sortedLeagues.findIndex(
						(l) => l.id === currentLeagueId
					);

					return (
						<TouchableOpacity
							key={league.id}
							onPress={() => onLeaguePress?.(league)}
							activeOpacity={0.9}
							style={{
								width: CARD_WIDTH,
								height: CARD_HEIGHT,
								marginRight: CARD_SPACING,
							}}
						>
							<Animated.View
								style={{
									transform: [{ scale }],
									opacity,
									flex: 1,
								}}
							>
								{isActive && (
									<Animated.View
										className="absolute inset-0 rounded-2xl"
										style={{
											backgroundColor: league.color,
											opacity: glow.interpolate({
												inputRange: [0, 1],
												outputRange: [0.1, 0.3],
											}),
											transform: [{ scale: 1.03 }],
										}}
									/>
								)}

								<LinearGradient
									colors={getLeagueGradient(league)}
									style={{
										shadowColor: league.color,
										shadowOffset: { width: 0, height: 6 },
										shadowOpacity: isActive ? 0.4 : 0.2,
										shadowRadius: isActive ? 12 : 6,
										elevation: isActive ? 10 : 4,
										borderWidth: isActive ? 2 : 1,
										borderColor: isActive ? league.color : `${league.color}40`,
										padding: 12,
										borderRadius: 16,
										flex: 1,
										justifyContent: "center",
									}}
								>
									<View className="items-center justify-center flex-1">
										<View className="relative mb-2">
											<View
												className="w-12 h-12 rounded-xl items-center justify-center"
												style={{
													backgroundColor: "rgba(255, 255, 255, 0.2)",
													borderWidth: 1.5,
													borderColor: "rgba(255, 255, 255, 0.3)",
												}}
											>
												<Text className="text-3xl">{getLeagueIcon(league.name)}</Text>
											</View>

											{/* Badge de rang */}
											<View
												className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
												style={{
													backgroundColor: theme.colors.mythologyGold,
													borderWidth: 1,
													borderColor: "white",
												}}
											>
												<Text
													className="text-xs font-bold"
													style={{
														color: "black",
														fontSize: 10,
													}}
												>
													{league.rank}
												</Text>
											</View>
										</View>

										<Text
											className="text-base font-bold text-center mb-1"
											style={{
												color: "white",
												fontFamily: theme.fonts.bold.fontFamily,
											}}
											numberOfLines={1}
											adjustsFontSizeToFit
										>
											{league.name}
										</Text>

										<View
											style={{
												height: 24,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{isActive && (
												<View className="flex-row items-center">
													<MaterialCommunityIcons
														name="check-circle"
														size={12}
														color="white"
													/>
													<Text
														className="text-xs font-medium ml-1"
														style={{
															color: "white",
															fontSize: 10,
														}}
													>
														Actuelle
													</Text>
												</View>
											)}

											{/* Flèche de progression */}
											{currentIndex >= 0 && index === currentIndex + 1 && (
												<View className="flex-row items-center">
													<MaterialCommunityIcons name="arrow-up" size={12} color="white" />
													<Text
														className="text-xs font-medium ml-1"
														style={{
															color: "white",
															opacity: 0.9,
															fontSize: 10,
														}}
													>
														Suivante
													</Text>
												</View>
											)}
										</View>
									</View>
								</LinearGradient>
							</Animated.View>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
			<View className="flex-row justify-center mt-3">
				{sortedLeagues.map((league, index) => {
					const isCurrentScroll = index === currentScrollIndex;
					const isActiveLigue = currentLeagueId === league.id;

					return (
						<TouchableOpacity
							key={league.id}
							onPress={() => {
								scrollViewRef.current?.scrollTo({
									x: index * (CARD_WIDTH + CARD_SPACING),
									animated: true,
								});
								setCurrentScrollIndex(index);
							}}
							style={{
								width: isCurrentScroll ? 24 : 8,
								height: 8,
								borderRadius: 4,
								marginHorizontal: 3,
								backgroundColor: isActiveLigue
									? league.color
									: isCurrentScroll
									? theme.colors.primary
									: theme.colors.border,
								opacity: isCurrentScroll ? 1 : 0.5,
							}}
						/>
					);
				})}
			</View>
		</View>
	);
};
