import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StatusBar, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { useLeague } from "../../hooks/useLeague";
import { OlympicPodium } from "../../components/OlympicPodium";
import { LeagueCarousel } from "../../components/LeagueCarousel";
import { CurrentLeagueCard } from "../../components/CurrentLeagueCard";
import { LeagueStats } from "../../components/LeagueStats";
import { PersonalProgressCard } from "../../components/PersonalProgressCard";
import { LeagueInfoButton } from "../../components/LeagueInfoModal";

if (__DEV__) {
	import("../../utils/LeagueDebugUtils");
}

const LeagueCurrent = () => {
	const { t } = useTranslation();
	const { member, setMember } = useData();
	const { theme } = useTheme();
	const { leagues, currentLeague, topMembers, loading } = useLeague(
		member || null,
		setMember
	);
	const loadingAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (loading) {
			Animated.loop(
				Animated.timing(loadingAnimation, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				})
			).start();
		}
	}, [loading]);

	if (loading) {
		return (
			<View
				className="flex-1 justify-center items-center px-4 pb-24"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Animated.View
					style={{
						shadowColor: theme.colors.background,
						shadowOffset: { width: 0, height: 8 },
						shadowOpacity: 0.3,
						shadowRadius: 12,
						elevation: 10,
						alignItems: "center",
						padding: 14,
						transform: [
							{
								rotate: loadingAnimation.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "360deg"],
								}),
							},
						],
					}}
				>
					<MaterialCommunityIcons
						name="loading"
						size={48}
						color={theme.colors.mythologyGold}
					/>
				</Animated.View>
				<Text
					className="text-lg mt-4 font-medium text-center"
					style={{
						color: theme.colors.textSecondary,
						fontFamily: theme.fonts.medium.fontFamily,
					}}
				>
					{t("loading_olympus")}
				</Text>
			</View>
		);
	}

	if (!member) {
		return (
			<View
				className="flex-1 justify-center items-center p-8"
				style={{ backgroundColor: theme.colors.background }}
			>
				<View
					className="rounded-3xl p-8 items-center"
					style={{
						backgroundColor: theme.colors.cardBackground,
						shadowColor: theme.colors.border,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.1,
						shadowRadius: 8,
						elevation: 5,
					}}
				>
					<MaterialCommunityIcons
						name="account-off"
						size={64}
						color={theme.colors.textTertiary}
					/>
					<Text
						className="text-lg mt-4 text-center"
						style={{
							color: theme.colors.textTertiary,
							fontFamily: theme.fonts.medium.fontFamily,
						}}
					>
						{t("no_god_connected")}
					</Text>
				</View>
			</View>
		);
	}

	const currentLeagueIndex = leagues.findIndex(
		(l) => l.id === currentLeague?.id
	);
	const nextLeague =
		currentLeagueIndex >= 0 && currentLeagueIndex < leagues.length - 1
			? leagues.sort((a, b) => a.rank - b.rank)[currentLeagueIndex + 1]
			: undefined;

	const maxPoints =
		topMembers.length > 0 ? topMembers[0]?.league?.points ?? 0 : 0;
	const averagePoints =
		topMembers.length > 0
			? Math.round(
					topMembers.reduce((acc, m) => acc + (m.league?.points ?? 0), 0) /
						topMembers.length
			  )
			: 0;

	return (
		<View
			className="flex-1 mb-24"
			style={{ backgroundColor: theme.colors.background }}
		>
			{/* Header avec bouton d'information */}
			<View className="flex-row items-center justify-between px-4 py-3">
				<Text
					className="text-2xl font-bold"
					style={{
						color: theme.colors.text,
						fontFamily: theme.fonts.bold.fontFamily,
					}}
				>
					{t("olympic_leagues")}
				</Text>
				<LeagueInfoButton />
			</View>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				{/* Carrousel des ligues */}
				<LeagueCarousel
					leagues={leagues}
					currentLeagueId={member?.league?.leagueId}
				/>

				{/* Carte de ligue actuelle */}
				{currentLeague && (
					<CurrentLeagueCard
						league={currentLeague}
						member={member}
						nextLeague={nextLeague}
					/>
				)}

				{/* Progression personnelle */}
				{currentLeague && member && (
					<PersonalProgressCard
						league={currentLeague}
						member={member}
						nextLeague={nextLeague}
					/>
				)}

				{/* Podium olympique */}

				{topMembers.length > 0 && (
					<View className="mb-6 mt-2">
						<OlympicPodium topMembers={topMembers} currentMember={member} />
					</View>
				)}

				{/* Statistiques */}
				{topMembers.length > 0 && (
					<LeagueStats
						participants={topMembers.length}
						record={maxPoints}
						average={averagePoints}
					/>
				)}

				{/* Message informatif si pas de top membres */}
				{topMembers.length === 0 && currentLeague && (
					<View className="mx-4 mb-6">
						<LinearGradient
							colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
							className="rounded-3xl p-8 items-center"
							style={{
								shadowColor: theme.colors.border,
								shadowOffset: { width: 0, height: 8 },
								shadowOpacity: 0.1,
								shadowRadius: 12,
								elevation: 8,
							}}
						>
							<MaterialCommunityIcons
								name="trophy-outline"
								size={48}
								color={theme.colors.textTertiary}
							/>
							<Text
								className="text-lg font-bold mt-4 text-center"
								style={{
									color: theme.colors.text,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{t("league_in_development")}
							</Text>
							<Text
								className="text-base mt-2 text-center"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
									lineHeight: 20,
								}}
							>
								{t("continue_earning_points")}
							</Text>
						</LinearGradient>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default LeagueCurrent;
