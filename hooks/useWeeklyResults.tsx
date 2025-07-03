import { useState, useEffect } from "react";
import { Member } from "../type/member";
import { League } from "../type/league.d";
import { LeagueRewardService } from "../services/LeagueRewardService";
import {
	WeeklyResultData,
	WeeklyResultType,
} from "../components/Modals/WeeklyResultModal";

interface UseWeeklyResultsProps {
	member: Member | null;
	currentLeague: League | null;
	allLeagues: League[];
	topMembers: Member[];
}

export const useWeeklyResults = ({
	member,
	currentLeague,
	allLeagues,
	topMembers,
}: UseWeeklyResultsProps) => {
	const [showWeeklyModal, setShowWeeklyModal] = useState(false);
	const [weeklyResultData, setWeeklyResultData] =
		useState<WeeklyResultData | null>(null);

	// Vérifier si c'est le début d'une nouvelle semaine
	const isNewWeek = () => {
		if (!member?.league?.lastWeeklyReset) return false;

		const lastReset = new Date(member.league.lastWeeklyReset);
		const now = new Date();

		// Calculer le début de la semaine actuelle (dimanche)
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		// Si le dernier reset était avant le début de cette semaine
		return lastReset < startOfWeek;
	};

	// Calculer les résultats de la semaine
	const calculateWeeklyResults = (): WeeklyResultData | null => {
		if (!member || !currentLeague) return null;

		const weeklyPoints = member.league?.weeklyPoints || 0;
		const weeklyTarget = currentLeague.weeklyPointsRequired || 150;
		const currentRank = member.league?.rank || 1;
		const totalParticipants = Math.max(topMembers.length, 10); // Minimum 10 avec des bots

		// Déterminer le résultat
		let resultType: WeeklyResultType;
		let newLeague: League | undefined;
		let totalReward: number;

		// Logique de promotion/relégation
		if (weeklyPoints >= weeklyTarget && currentRank <= 3) {
			// Promotion possible
			const nextLeague = allLeagues.find((l) => l.rank === currentLeague.rank + 1);
			if (nextLeague) {
				resultType = "promotion";
				newLeague = nextLeague;
				totalReward = LeagueRewardService.calculateWeeklyReward(
					currentLeague,
					"promotion"
				);
			} else {
				resultType = "maintained";
				totalReward = LeagueRewardService.calculateWeeklyReward(
					currentLeague,
					"maintained"
				);
			}
		} else if (weeklyPoints >= weeklyTarget * 0.5) {
			// Maintien
			resultType = "maintained";
			totalReward = LeagueRewardService.calculateWeeklyReward(
				currentLeague,
				"maintained"
			);
		} else {
			// Relégation
			const previousLeague = allLeagues.find(
				(l) => l.rank === currentLeague.rank - 1
			);
			if (previousLeague && currentLeague.rank > 1) {
				resultType = "relegated";
				newLeague = previousLeague;
				totalReward = LeagueRewardService.calculateWeeklyReward(
					currentLeague,
					"relegated"
				);
			} else {
				resultType = "maintained";
				totalReward = LeagueRewardService.calculateWeeklyReward(
					currentLeague,
					"maintained"
				);
			}
		}

		return {
			type: resultType,
			currentLeague,
			newLeague,
			weeklyPoints,
			totalReward,
			rankInLeague: currentRank,
			totalParticipants,
		};
	};

	// Vérifier et afficher la modal si nécessaire
	useEffect(() => {
		if (member && currentLeague && isNewWeek()) {
			const results = calculateWeeklyResults();
			if (results) {
				setWeeklyResultData(results);
				setShowWeeklyModal(true);
			}
		}
	}, [member, currentLeague, allLeagues, topMembers]);

	// Fonction pour déclencher manuellement la modal (pour les tests)
	const triggerWeeklyModal = () => {
		const results = calculateWeeklyResults();
		if (results) {
			setWeeklyResultData(results);
			setShowWeeklyModal(true);
		}
	};

	return {
		showWeeklyModal,
		setShowWeeklyModal,
		weeklyResultData,
		triggerWeeklyModal,
	};
};
