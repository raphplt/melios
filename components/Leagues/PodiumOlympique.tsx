import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { League } from "../../type/league.d";

interface PodiumParticipant {
	name: string;
	points: number;
	rank: number;
	avatarUrl?: string;
	isCurrentUser?: boolean;
}

interface PodiumOlympiqueProps {
	participants: PodiumParticipant[];
	currentLeague?: League | null;
}

export const PodiumOlympique: React.FC<PodiumOlympiqueProps> = ({
	participants,
	currentLeague,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	// Réorganiser pour avoir 2e, 1er, 3e (ordre du podium visuel)
	const orderedParticipants = participants
		.sort((a, b) => a.rank - b.rank)
		.slice(0, 3);

	const getPodiumHeight = (rank: number) => {
		switch (rank) {
			case 1:
				return 80; // Le plus haut
			case 2:
				return 60; // Moyen
			case 3:
				return 40; // Le plus bas
			default:
				return 40;
		}
	};
	const getPodiumColors = (rank: number): [string, string] => {
		switch (rank) {
			case 1:
				return [
					theme.colors.mythologyGold || "#F4E4A6",
					theme.colors.mythologyGold || "#F4E4A6",
				];
			case 2:
				return [
					theme.colors.grayPrimary || "#C0C0C0",
					theme.colors.backgroundSecondary || "#E8E8E8",
				];
			case 3:
				return [
					theme.colors.orangePrimary || "#CD7F32",
					theme.colors.orangeSecondary || "#D2B48C",
				];
			default:
				return [
					theme.colors.grayPrimary || "#B0B0B0",
					theme.colors.cardBackground || "#F6F6F6",
				];
		}
	};

	const getCrownIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "crown";
			case 2:
				return "trophy-outline";
			case 3:
				return "medal";
			default:
				return "medal-outline";
		}
	};

	if (orderedParticipants.length === 0) {
		return null;
	}

	// Réorganiser pour l'affichage : [2e, 1er, 3e]
	const displayOrder = [
		orderedParticipants.find((p) => p.rank === 2),
		orderedParticipants.find((p) => p.rank === 1),
		orderedParticipants.find((p) => p.rank === 3),
	].filter(Boolean) as PodiumParticipant[];
	return (
		<View className="mx-4 mb-6">
			<LinearGradient
				colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
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
				{/* Titre */}
				<View className="items-center mb-6">
					<Text
						className="text-xl font-bold mb-2"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						{t("leagues.podium.title")}
					</Text>
					{currentLeague && (
						<View className="flex-row items-center justify-center">
							<CachedImage
								imagePath={`images/badges/${currentLeague.iconUrl}`}
								style={{
									width: 16,
									height: 16,
									marginRight: 6,
								}}
								placeholder={
									<MaterialCommunityIcons
										name="medal"
										size={16}
										color={currentLeague.color}
									/>
								}
							/>
							<Text
								className="text-sm"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{t("leagues.podium.champions_of", { league: currentLeague.name })}
							</Text>
						</View>
					)}
				</View>

				{/* Podium */}
				<View className="flex-row items-end justify-center">
					{displayOrder.map((participant, index) => (
						<View key={participant.rank} className="flex-1 items-center mx-1">
							{/* Avatar et couronne */}
							<View className="items-center mb-2">
								{participant.rank === 1 && (
									<MaterialCommunityIcons
										name="crown"
										size={24}
										color={theme.colors.mythologyGold}
										style={{ marginBottom: 4 }}
									/>
								)}

								{/* Avatar */}
								<View
									className="w-16 h-16 rounded-full items-center justify-center overflow-hidden"
									style={{
										backgroundColor: participant.isCurrentUser
											? theme.colors.primary + "20"
											: theme.colors.grayPrimary + "20",
										borderWidth: participant.isCurrentUser ? 3 : 2,
										borderColor: participant.isCurrentUser
											? theme.colors.primary
											: getPodiumColors(participant.rank)[0],
									}}
								>
									{participant.avatarUrl ? (
										<Image
											source={{ uri: participant.avatarUrl }}
											className="w-full h-full"
											style={{ resizeMode: "cover" }}
										/>
									) : (
										<MaterialCommunityIcons
											name="account-circle"
											size={40}
											color={
												participant.isCurrentUser
													? theme.colors.primary
													: theme.colors.textTertiary
											}
										/>
									)}
								</View>

								{/* Icône de rang */}
								<View
									className="w-8 h-8 rounded-full items-center justify-center mt-1"
									style={{
										backgroundColor: getPodiumColors(participant.rank)[0],
									}}
								>
									<MaterialCommunityIcons
										name={getCrownIcon(participant.rank)}
										size={16}
										color="white"
									/>
								</View>
							</View>
							{/* Nom */}
							<Text
								className="text-sm font-bold text-center mb-1"
								numberOfLines={1}
								style={{
									color: participant.isCurrentUser
										? theme.colors.primary
										: theme.colors.text,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{participant.name}
							</Text>
							{/* Points */}
							<Text
								className="text-xs text-center mb-2"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{participant.points} pts
							</Text>
							{/* Base du podium */}
							<LinearGradient
								colors={getPodiumColors(participant.rank)}
								style={{
									width: "100%",
									borderTopLeftRadius: 8,
									borderTopRightRadius: 8,
									alignItems: "center",
									justifyContent: "center",
									height: getPodiumHeight(participant.rank),
								}}
							>
								<Text
									className="text-2xl font-bold"
									style={{
										color: "white",
										fontFamily: theme.fonts.bold.fontFamily,
									}}
								>
									{participant.rank}
								</Text>
							</LinearGradient>
						</View>
					))}
				</View>

				{/* Indicateur utilisateur actuel */}
				{displayOrder.some((p) => p.isCurrentUser) && (
					<View className="flex-row items-center justify-center mt-4">
						<MaterialCommunityIcons
							name="account-star"
							size={16}
							color={theme.colors.primary}
							style={{ marginRight: 6 }}
						/>
						<Text
							className="text-xs"
							style={{
								color: theme.colors.primary,
								fontFamily: theme.fonts.medium.fontFamily,
							}}
						>
							{t("you_are_here")}
						</Text>
					</View>
				)}
			</LinearGradient>
		</View>
	);
};
