import React, { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import UserBadge from "./Shared/UserBadge";
import { Member } from "../type/member";

interface PodiumProps {
	topMembers: Member[];
	currentMember: Member | null;
}

export const OlympicPodium: React.FC<PodiumProps> = ({
	topMembers,
	currentMember,
}) => {
	const { theme } = useTheme();
	const animationValues = useRef(
		topMembers.map(() => ({
			scale: new Animated.Value(0),
			opacity: new Animated.Value(0),
			bounce: new Animated.Value(1),
		}))
	).current;

	const crownAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Animation d'entrée du podium
		topMembers.forEach((_, index) => {
			const delay = index * 200;
			Animated.sequence([
				Animated.delay(delay),
				Animated.parallel([
					Animated.spring(animationValues[index].scale, {
						toValue: 1,
						tension: 100,
						friction: 6,
						useNativeDriver: true,
					}),
					Animated.timing(animationValues[index].opacity, {
						toValue: 1,
						duration: 400,
						useNativeDriver: true,
					}),
				]),
			]).start();
		});

		// Animation de couronne pour le 1er
		if (topMembers.length > 0) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(crownAnimation, {
						toValue: 1,
						duration: 2000,
						useNativeDriver: true,
					}),
					Animated.timing(crownAnimation, {
						toValue: 0,
						duration: 2000,
						useNativeDriver: true,
					}),
				])
			).start();
		}

		// Animation de bounce pour le 1er
		if (animationValues[0]) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(animationValues[0].bounce, {
						toValue: 1.05,
						duration: 1500,
						useNativeDriver: true,
					}),
					Animated.timing(animationValues[0].bounce, {
						toValue: 1,
						duration: 1500,
						useNativeDriver: true,
					}),
				])
			).start();
		}
	}, [topMembers]);

	const getPodiumHeight = (position: number) => {
		switch (position) {
			case 0:
				return 120; // 1er
			case 1:
				return 100; // 2e
			case 2:
				return 80; // 3e
			default:
				return 60;
		}
	};

	const getPodiumColors = (position: number): [string, string] => {
		switch (position) {
			case 0:
				return [theme.colors.mythologyGold || "#FFD700", "#FFA500"]; // Or
			case 1:
				return ["#C0C0C0", "#A8A8A8"]; // Argent
			case 2:
				return ["#CD7F32", "#B8860B"]; // Bronze
			default:
				return [theme.colors.border, theme.colors.backgroundSecondary];
		}
	};

	const getMedalIcon = (position: number) => {
		switch (position) {
			case 0:
				return "👑";
			case 1:
				return "🥈";
			case 2:
				return "🥉";
			default:
				return "🏅";
		}
	};

	if (topMembers.length === 0) return null;

	return (
		<View className="px-4 mb-6">
			<View className="flex-row justify-center items-end space-x-2">
				{/* 2e place */}
				{topMembers[1] && (
					<Animated.View
						style={{
							opacity: animationValues[1]?.opacity || 1,
							transform: [{ scale: animationValues[1]?.scale || 1 }],
						}}
						className="items-center"
					>
						<View className="items-center mb-2">
							<UserBadge
								width={50}
								height={50}
								customProfilePicture={topMembers[1].profilePicture || ""}
								style={{
									borderWidth: 3,
									borderColor: "#C0C0C0",
									marginBottom: 8,
								}}
							/>
							<Text
								className="text-sm font-medium text-center"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.medium.fontFamily,
									maxWidth: 60,
								}}
								numberOfLines={1}
							>
								{topMembers[1].nom}
							</Text>
							<Text
								className="text-lg font-bold"
								style={{
									color: "#C0C0C0",
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{topMembers[1].league?.points ?? 0}
							</Text>
						</View>
						<LinearGradient
							colors={getPodiumColors(1)}
							style={{
								width: 80,
								height: getPodiumHeight(1),
								borderTopLeftRadius: 12,
								borderTopRightRadius: 12,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text className="text-2xl">🥈</Text>
							<Text
								className="text-white font-bold text-lg"
								style={{ fontFamily: theme.fonts.bold.fontFamily }}
							>
								2
							</Text>
						</LinearGradient>
					</Animated.View>
				)}

				{/* 1ère place */}
				{topMembers[0] && (
					<Animated.View
						style={{
							opacity: animationValues[0]?.opacity || 1,
							transform: [
								{ scale: animationValues[0]?.scale || 1 },
								{ scale: animationValues[0]?.bounce || 1 },
							],
						}}
						className="items-center"
					>
						<View className="items-center mb-2">
							{/* Couronne animée */}
							<Animated.View
								className="absolute -top-4 z-10"
								style={{
									opacity: crownAnimation.interpolate({
										inputRange: [0, 1],
										outputRange: [0.7, 1],
									}),
									transform: [
										{
											translateY: crownAnimation.interpolate({
												inputRange: [0, 1],
												outputRange: [0, -3],
											}),
										},
									],
								}}
							>
								<Text className="text-2xl">👑</Text>
							</Animated.View>

							<UserBadge
								width={60}
								height={60}
								customProfilePicture={topMembers[0].profilePicture || ""}
								style={{
									borderWidth: 4,
									borderColor: theme.colors.mythologyGold,
									marginBottom: 8,
								}}
							/>
							<Text
								className="text-base font-bold text-center"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.bold.fontFamily,
									maxWidth: 70,
								}}
								numberOfLines={1}
							>
								{topMembers[0].nom}
							</Text>
							<Text
								className="text-xl font-bold"
								style={{
									color: theme.colors.mythologyGold,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{topMembers[0].league?.points ?? 0}
							</Text>
						</View>
						<LinearGradient
							colors={getPodiumColors(0)}
							style={{
								width: 90,
								height: getPodiumHeight(0),
								borderTopLeftRadius: 12,
								borderTopRightRadius: 12,
								justifyContent: "center",
								alignItems: "center",
								shadowColor: theme.colors.mythologyGold,
								shadowOffset: { width: 0, height: 8 },
								shadowOpacity: 0.3,
								shadowRadius: 12,
								elevation: 10,
							}}
						>
							<Text className="text-3xl">👑</Text>
							<Text
								className="text-white font-bold text-xl"
								style={{ fontFamily: theme.fonts.bold.fontFamily }}
							>
								1
							</Text>
						</LinearGradient>
					</Animated.View>
				)}

				{/* 3e place */}
				{topMembers[2] && (
					<Animated.View
						style={{
							opacity: animationValues[2]?.opacity || 1,
							transform: [{ scale: animationValues[2]?.scale || 1 }],
						}}
						className="items-center"
					>
						<View className="items-center mb-2">
							<UserBadge
								width={45}
								height={45}
								customProfilePicture={topMembers[2].profilePicture || ""}
								style={{
									borderWidth: 3,
									borderColor: "#CD7F32",
									marginBottom: 8,
								}}
							/>
							<Text
								className="text-sm font-medium text-center"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.medium.fontFamily,
									maxWidth: 55,
								}}
								numberOfLines={1}
							>
								{topMembers[2].nom}
							</Text>
							<Text
								className="text-base font-bold"
								style={{
									color: "#CD7F32",
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{topMembers[2].league?.points ?? 0}
							</Text>
						</View>
						<LinearGradient
							colors={getPodiumColors(2)}
							style={{
								width: 70,
								height: getPodiumHeight(2),
								borderTopLeftRadius: 12,
								borderTopRightRadius: 12,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text className="text-xl">🥉</Text>
							<Text
								className="text-white font-bold text-base"
								style={{ fontFamily: theme.fonts.bold.fontFamily }}
							>
								3
							</Text>
						</LinearGradient>
					</Animated.View>
				)}
			</View>
		</View>
	);
};
