import { useCallback } from "react";
import { useData } from "../context/DataContext";
import { LeagueRewardService, LeagueRewardCalculation } from "../services/LeagueRewardService";
import { addRewardsToMember } from "../db/rewards";
import { getLeagueById } from "../db/leagues";

export const useLeagueRewards = () => {
	const { member, setMember, points, setPoints } = useData();

	/**
	 * Applique les récompenses de ligue pour une action donnée
	 */
	const applyLeagueReward = useCallback(async (
		actionType: "habit" | "goal" | "daily",
		baseReward: number = 10,
		difficulty: number = 1
	): Promise<LeagueRewardCalculation | null> => {
		if (!member?.league?.leagueId) {
			console.warn("No league found for member");
			return null;
		}

		try {
			// Récupérer les informations de la ligue actuelle
			const currentLeague = await getLeagueById(member.league.leagueId);
			if (!currentLeague) {
				console.warn("League not found:", member.league.leagueId);
				return null;
			}

			let rewardCalculation: LeagueRewardCalculation;

			// Calculer les récompenses selon le type d'action
			switch (actionType) {
				case "habit":
					rewardCalculation = LeagueRewardService.calculateHabitCompletionReward(
						currentLeague, 
						difficulty
					);
					break;
				case "goal":
					rewardCalculation = LeagueRewardService.calculateGoalCompletionReward(
						currentLeague, 
						baseReward
					);
					break;
				case "daily":
					const dailyBonus = LeagueRewardService.calculateDailyLeagueBonus(currentLeague);
					rewardCalculation = {
						baseReward: dailyBonus,
						leagueMultiplier: 1,
						totalReward: dailyBonus,
						leagueName: currentLeague.name,
						leagueRank: currentLeague.rank,
					};
					break;
				default:
					rewardCalculation = LeagueRewardService.calculateLeagueReward(
						currentLeague, 
						baseReward
					);
			}

			// Appliquer les récompenses aux points du membre
			const newPoints = LeagueRewardService.applyRewardToPoints(points, rewardCalculation);
			
			// Mettre à jour la base de données
			if (member.uid) {
				await addRewardsToMember(member.uid, "rewards", rewardCalculation.totalReward);
			}
			
			// Mettre à jour les états locaux
			setPoints(newPoints);

			// Log pour le debug
			console.log(`League reward applied:`, {
				action: actionType,
				league: currentLeague.name,
				baseReward: rewardCalculation.baseReward,
				multiplier: rewardCalculation.leagueMultiplier,
				totalReward: rewardCalculation.totalReward,
			});

			return rewardCalculation;
		} catch (error) {
			console.error("Error applying league reward:", error);
			return null;
		}
	}, [member, points, setPoints]);

	/**
	 * Obtient les informations de récompense pour la ligue actuelle
	 */
	const getCurrentLeagueRewardInfo = useCallback(async () => {
		if (!member?.league?.leagueId) return null;

		try {
			const currentLeague = await getLeagueById(member.league.leagueId);
			if (!currentLeague) return null;

			return LeagueRewardService.getLeagueRewardDescription(currentLeague);
		} catch (error) {
			console.error("Error getting league reward info:", error);
			return null;
		}
	}, [member?.league?.leagueId]);

	/**
	 * Formate l'affichage d'une récompense
	 */
	const formatReward = useCallback((calculation: LeagueRewardCalculation): string => {
		return LeagueRewardService.formatRewardDisplay(calculation);
	}, []);

	/**
	 * Vérifie si le membre peut bénéficier du bonus quotidien
	 */
	const canClaimDailyBonus = useCallback((): boolean => {
		// TODO: Implémenter la logique pour vérifier si le bonus quotidien a déjà été réclamé
		// Cela pourrait être stocké dans AsyncStorage ou dans la base de données
		return true;
	}, []);

	/**
	 * Réclame le bonus quotidien de ligue
	 */
	const claimDailyLeagueBonus = useCallback(async (): Promise<LeagueRewardCalculation | null> => {
		if (!canClaimDailyBonus()) {
			console.log("Daily bonus already claimed");
			return null;
		}

		return await applyLeagueReward("daily", 0, 1);
	}, [applyLeagueReward, canClaimDailyBonus]);

	return {
		applyLeagueReward,
		getCurrentLeagueRewardInfo,
		formatReward,
		canClaimDailyBonus,
		claimDailyLeagueBonus,
	};
};
