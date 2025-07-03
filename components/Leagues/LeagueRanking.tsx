import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import UserBadge from "@components/Shared/UserBadge";
import { Member } from "../../type/member";
import { League } from "../../type/league.d";
import {
	BotMember,
	BotGeneratorService,
} from "../../services/BotGeneratorService";

interface LeagueRankingProps {
	currentMember: Member;
	topMembers: Member[];
	currentLeague: League | null;
	onMemberPress?: (member: Member | BotMember) => void;
}

export const LeagueRanking: React.FC<LeagueRankingProps> = ({
	currentMember,
	topMembers,
	currentLeague,
	onMemberPress,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const enhancedRanking = useMemo(() => {
		if (!currentLeague) return [];

		// Générer des bots si nécessaire
		const allRealMembers = [...topMembers];
		if (!allRealMembers.find((m) => m.uid === currentMember.uid)) {
			allRealMembers.push(currentMember);
		}

		const bots = BotGeneratorService.generateBotsForLeague(
			currentMember,
			currentLeague.id,
			Math.max(15, allRealMembers.length + 5), // Au moins 15 membres au total
			allRealMembers
		);

		// Combiner et trier par rang
		const allMembers = BotGeneratorService.assignRanks([
			...allRealMembers,
			...bots,
		]);

		return allMembers;
	}, [currentMember, topMembers, currentLeague]);

	const currentMemberRank =
		enhancedRanking.findIndex((m) => m.uid === currentMember.uid) + 1;

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "trophy";
			case 2:
				return "medal";
			case 3:
				return "medal-outline";
			default:
				return "account-circle";
		}
	};

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return theme.colors.mythologyGold;
			case 2:
				return "#C0C0C0"; // Silver
			case 3:
				return "#CD7F32"; // Bronze
			default:
				return theme.colors.textTertiary;
		}
	};

	const MemberRow = ({
		member,
		index,
	}: {
		member: Member | BotMember;
		index: number;
	}) => {
		const rank = index + 1;
		const isCurrentUser = member.uid === currentMember.uid;
		const isBot = BotGeneratorService.isBot(member);
		const points = member.league?.points ?? 0;

		return (
			<TouchableOpacity
				key={member.uid}
				onPress={() => onMemberPress?.(member)}
				activeOpacity={isBot ? 1 : 0.7}
				style={{
					flexDirection: "row",
					alignItems: "center",
					paddingVertical: 12,
					paddingHorizontal: 16,
					backgroundColor: isCurrentUser
						? theme.colors.primary + "15"
						: "transparent",
					borderRadius: 12,
					marginBottom: 8,
					borderWidth: isCurrentUser ? 1 : 0,
					borderColor: isCurrentUser ? theme.colors.primary + "30" : "transparent",
				}}
			>
				{/* Rang */}
				<View
					style={{
						width: 40,
						alignItems: "center",
					}}
				>
					<MaterialCommunityIcons
						name={getRankIcon(rank)}
						size={rank <= 3 ? 24 : 20}
						color={isCurrentUser ? theme.colors.textSecondary : getRankColor(rank)}
					/>
					<Text
						style={{
							fontSize: 10,
							fontFamily: theme.fonts.bold.fontFamily,
							color: isCurrentUser ? theme.colors.textSecondary : getRankColor(rank),
							marginTop: 2,
						}}
					>
						#{rank}
					</Text>
				</View>

				{/* Avatar */}
				<View
					style={{
						marginLeft: 12,
						marginRight: 16,
					}}
				>
					<UserBadge
						width={40}
						height={40}
						customProfilePicture={member.profilePicture}
						style={{
							borderWidth: isCurrentUser ? 2 : 0,
							borderColor: isCurrentUser ? theme.colors.primary : "transparent",
						}}
					/>
				</View>

				{/* Nom et indicateur bot */}
				<View style={{ flex: 1 }}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text
							numberOfLines={1}
							style={{
								fontSize: 14,
								fontFamily: isCurrentUser
									? theme.fonts.bold.fontFamily
									: theme.fonts.medium.fontFamily,
								color: isCurrentUser ? theme.colors.textSecondary : theme.colors.text,
								flex: 1,
							}}
						>
							{member.nom}
						</Text>
						{isBot && (
							<View
								style={{
									backgroundColor: theme.colors.grayPrimary + "20",
									paddingHorizontal: 6,
									paddingVertical: 2,
									borderRadius: 8,
									marginLeft: 8,
								}}
							>
								<Text
									style={{
										fontSize: 8,
										fontFamily: theme.fonts.regular.fontFamily,
										color: theme.colors.grayPrimary,
									}}
								>
									BOT
								</Text>
							</View>
						)}
						{isCurrentUser && (
							<View
								style={{
									backgroundColor: theme.colors.primary,
									paddingHorizontal: 6,
									paddingVertical: 2,
									borderRadius: 8,
									marginLeft: 8,
								}}
							>
								<Text
									style={{
										fontSize: 8,
										fontFamily: theme.fonts.bold.fontFamily,
										color: theme.colors.textSecondary,
									}}
								>
									{t("you")}
								</Text>
							</View>
						)}
					</View>
				</View>

				{/* Points */}
				<View style={{ alignItems: "flex-end" }}>
					<Text
						style={{
							fontSize: 16,
							fontFamily: theme.fonts.bold.fontFamily,
							color: isCurrentUser ? theme.colors.textSecondary : theme.colors.text,
						}}
					>
						{points}
					</Text>
					<Text
						style={{
							fontSize: 10,
							fontFamily: theme.fonts.regular.fontFamily,
							color: isCurrentUser
								? theme.colors.textSecondary
								: theme.colors.textTertiary,
						}}
					>
						{t("points")}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	if (!currentLeague || enhancedRanking.length === 0) return null;

	// Afficher les 10 premiers, puis le membre actuel s'il n'est pas dans le top 10
	const topTen = enhancedRanking.slice(0, 10);
	const showCurrentMember = currentMemberRank > 10;

	return (
		<View style={{ marginHorizontal: 16, marginBottom: 20 }}>
			<LinearGradient
				colors={[theme.colors.cardBackground, theme.colors.background]}
				style={{
					borderRadius: 20,
					padding: 20,
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 5,
				}}
			>
				{/* Header */}
				<View
					style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
				>
					<MaterialCommunityIcons
						name="trophy-variant"
						size={24}
						color={theme.colors.mythologyGold}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={{
							fontSize: 18,
							fontFamily: theme.fonts.bold.fontFamily,
							color: theme.colors.text,
							flex: 1,
						}}
					>
						{t("leagues.ranking.title")}
					</Text>
					<Text
						style={{
							fontSize: 12,
							fontFamily: theme.fonts.medium.fontFamily,
							color: theme.colors.textTertiary,
						}}
					>
						{t("leagues.ranking.your_rank", { rank: currentMemberRank })}
					</Text>
				</View>

				{/* Liste des membres */}
				<View>
					{topTen.map((member, index) => (
						<MemberRow key={member.uid} member={member} index={index} />
					))}

					{/* Séparateur et position actuelle si hors du top 10 */}
					{showCurrentMember && (
						<>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginVertical: 16,
								}}
							>
								<View
									style={{
										flex: 1,
										height: 1,
										backgroundColor: theme.colors.border,
									}}
								/>
								<Text
									style={{
										marginHorizontal: 16,
										fontSize: 12,
										fontFamily: theme.fonts.regular.fontFamily,
										color: theme.colors.textTertiary,
									}}
								>
									...
								</Text>
								<View
									style={{
										flex: 1,
										height: 1,
										backgroundColor: theme.colors.border,
									}}
								/>
							</View>
							<MemberRow
								member={enhancedRanking[currentMemberRank - 1]}
								index={currentMemberRank - 1}
							/>
						</>
					)}
				</View>

				{/* Footer info */}
				<View
					style={{
						marginTop: 16,
						padding: 12,
						backgroundColor: theme.colors.primary + "10",
						borderRadius: 12,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<MaterialCommunityIcons
						name="information"
						size={16}
						color={theme.colors.primary}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={{
							fontSize: 11,
							fontFamily: theme.fonts.regular.fontFamily,
							color: theme.colors.textSecondary,
							flex: 1,
							lineHeight: 14,
						}}
					>
						{t("leagues.ranking.bot_info")}
					</Text>
				</View>
			</LinearGradient>
		</View>
	);
};
