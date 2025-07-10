import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	Animated,
	TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useLeague } from "@hooks/useLeague";
import { useWeeklyResults } from "@hooks/useWeeklyResults";
import { LeagueInfoButton } from "@components/LeagueInfoModal";
import {
	LeagueCarousel,
	LeagueBadgeProgression,
	LeagueTimeRemaining,
	LeagueRewardsDisplay,
	LeagueRanking,
	OlympicPodium,
	LeagueStatistics,
} from "@components/Leagues";
import { WeeklyResultModal } from "@components/Modals";

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
	const {
		showWeeklyModal,
		setShowWeeklyModal,
		weeklyResultData,
		triggerWeeklyModal,
	} = useWeeklyResults({
		member: member || null,
		currentLeague,
		allLeagues: leagues,
		topMembers,
	});
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
		return <LoaderScreen />;
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

	// Logique pour calculer les données nécessaires aux nouveaux composants
	const sortedLeagues = leagues.sort((a, b) => a.rank - b.rank);
	const currentLeagueIndex = sortedLeagues.findIndex(
		(l) => l.id === currentLeague?.id
	);
	const nextLeague =
		currentLeagueIndex >= 0 && currentLeagueIndex < sortedLeagues.length - 1
			? sortedLeagues[currentLeagueIndex + 1]
			: undefined;

	const currentPoints = member?.league?.points ?? 0;
	const currentWeeklyPoints = member?.league?.weeklyPoints ?? 0;
	const targetPoints = nextLeague?.pointsRequired ?? 0;
	const weeklyTargetPoints = currentLeague?.weeklyPointsRequired ?? 150;

	// Calculer les jours restants dans la semaine
	const now = new Date();
	const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	const daysLeft = Math.ceil(
		(endOfWeek.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
	);

	// Progression vers la ligue suivante
	const progressPercent = nextLeague
		? Math.min((currentPoints / targetPoints) * 100, 100)
		: 100;

	// Déterminer si c'est une ligue solo
	const isSoloLeague = topMembers.length <= 1;

	// Préparer les données du podium
	const podiumParticipants = topMembers.slice(0, 3).map((topMember, index) => ({
		name: topMember.nom,
		points: topMember.league?.points ?? 0,
		rank: index + 1,
		avatarUrl: topMember.profilePicture,
		isCurrentUser: topMember.uid === member.uid,
	}));

	// Calculer les statistiques
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
				<View className="flex-row items-center">
					{/* Bouton de test pour la modal hebdomadaire (dev only) */}
					{__DEV__ && (
						<TouchableOpacity
							onPress={triggerWeeklyModal}
							className="mr-2"
							style={{
								backgroundColor: theme.colors.primary,
								borderRadius: 20,
								width: 40,
								height: 40,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<MaterialCommunityIcons name="trophy" size={20} color="white" />
						</TouchableOpacity>
					)}
					<LeagueInfoButton />
				</View>
			</View>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 40, paddingTop: 12 }}
			>
				{currentLeague && (
					<LeagueCarousel
						leagues={leagues}
						currentLeague={currentLeague}
						onLeaguePress={(league) => {
							// TODO: Implement league detail view or info modal
							console.log("Selected league:", league.name);
						}}
					/>
				)}

				{currentLeague && (
					<LeagueBadgeProgression
						currentLeague={currentLeague}
						currentRank={member.league?.rank ?? 1}
						currentPoints={currentPoints}
						nextLeague={nextLeague}
						progressPercent={progressPercent}
					/>
				)}
				{currentLeague && (
					<LeagueTimeRemaining
						currentLeague={currentLeague}
						daysLeft={Math.max(daysLeft, 1)}
					/>
				)}

				{currentLeague && (
					<LeagueRewardsDisplay
						currentLeague={currentLeague}
						onInfoPress={() => {
							// TODO: Implement detailed reward info modal
							console.log("Show reward info for:", currentLeague.name);
						}}
					/>
				)}

				{/* <WeeklyObjectiveProgression
					currentPoints={currentWeeklyPoints}
					targetPoints={weeklyTargetPoints}
					daysLeft={Math.max(daysLeft, 1)}
					currentLeague={currentLeague}
				/> */}

				<LeagueRanking
					currentMember={member}
					topMembers={topMembers}
					currentLeague={currentLeague}
					onMemberPress={(selectedMember) => {
						// TODO: Implement member profile view or info modal
						console.log("Selected member:", selectedMember.nom);
					}}
				/>

				{!isSoloLeague && podiumParticipants.length > 0 && (
					<OlympicPodium
						participants={podiumParticipants}
						currentLeague={currentLeague}
					/>
				)}
				{!isSoloLeague && (
					<LeagueStatistics
						totalParticipants={topMembers.length}
						record={maxPoints}
						moyenne={averagePoints}
						isSoloLeague={isSoloLeague}
					/>
				)}
			</ScrollView>

			{/* Modal de résultats hebdomadaires */}
			<WeeklyResultModal
				visible={showWeeklyModal}
				setVisible={setShowWeeklyModal}
				resultData={weeklyResultData}
				member={member!}
			/>
		</View>
	);
};

export default LeagueCurrent;
