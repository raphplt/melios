import { View, Text, Animated } from "react-native";
import { League } from "../type/league";
import { Member } from "../type/member";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

interface CurrentLeagueProps {
	league: League;
	member: Member;
}

export const CurrentLeague = ({ league, member }: CurrentLeagueProps) => {
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
				className="rounded-3xl border-2"
				style={{
					borderColor: league.color,
					backgroundColor: `${league.color}05`, // Solid background color for shadow
					shadowColor: league.color,
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.3,
					shadowRadius: 12,
					elevation: 10,
				}}
			>
				<LinearGradient
					colors={[`${league.color}20`, `${league.color}10`, "transparent"]}
					className="rounded-3xl p-6"
				>
					{/* Shimmer overlay */}
					<Animated.View
						className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl overflow-hidden"
						style={{ opacity: 0.1 }}
					>
						<Animated.View
							className="w-20 h-full"
							style={{
								backgroundColor: "white",
								transform: [{ translateX: shimmerTranslate }],
								opacity: 0.3,
							}}
						/>
					</Animated.View>

					<View className="flex-row items-center">
						{/* Trophy with gradient background */}
						<View className="mr-5">
							<View
								className="w-16 h-16 rounded-2xl items-center justify-center"
								style={{
									backgroundColor: `${league.color}20`, // Solid background for shadow
									shadowColor: league.color,
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.4,
									shadowRadius: 8,
									elevation: 6,
								}}
							>
								<LinearGradient
									colors={[league.color, `${league.color}DD`]}
									className="w-16 h-16 rounded-2xl items-center justify-center"
								>
									<MaterialCommunityIcons name="trophy" size={32} color="white" />
								</LinearGradient>
							</View>

							{/* Rank badge */}
							<View
								className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
								style={{ backgroundColor: "#FFD700" }}
							>
								<Text className="text-sm font-bold text-black">{league.rank}</Text>
							</View>
						</View>

						{/* League info */}
						<View className="flex-1">
							<Text className="text-2xl font-bold text-white mb-1">{league.name}</Text>

							<View className="flex-row items-center mb-3">
								<MaterialCommunityIcons name="medal" size={16} color="#FFD700" />
								<Text className="text-base text-gray-300 ml-1">Rang {league.rank}</Text>
							</View>

							{/* Points with animation */}
							<Animated.View
								style={{ transform: [{ scale: pulseAnimation }] }}
								className="bg-yellow-400 rounded-xl px-4 py-2 self-start"
							>
								<View className="flex-row items-center">
									<MaterialCommunityIcons name="star" size={18} color="#000" />
									<Text className="text-lg font-bold text-black ml-1">
										{member.league?.points || 0} points
									</Text>
								</View>
								<Text className="text-xs text-black opacity-70">cette semaine</Text>
							</Animated.View>
						</View>
					</View>

					{/* Progress indicator */}
					<View className="mt-4 pt-4 border-t border-gray-600">
						<View className="flex-row justify-between items-center">
							<Text className="text-gray-300 text-sm">Progression</Text>
							<Text className="text-yellow-400 text-sm font-bold">
								+{member.league?.points || 0} pts
							</Text>
						</View>
						<View className="w-full h-2 bg-gray-700 rounded-full mt-2">
							<LinearGradient
								colors={["#FFD700", "#FFA500"]}
								className="h-2 rounded-full"
								style={{
									width: `${Math.min(((member.league?.points || 0) / 100) * 100, 100)}%`,
								}}
							/>
						</View>
					</View>
				</LinearGradient>
			</View>
		</View>
	);
};
