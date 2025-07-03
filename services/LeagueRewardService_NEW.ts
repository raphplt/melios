import { Member } from "../type/member";
import { League } from "../type/league.d";
import { Points } from "../type/points.d";

export interface LeagueReward {
	meliosPoints: number;
	multiplier: number;
	bonusDescription: string;
}

export interface LeagueRewardCalculation {
	baseReward: number;
	leagueMultiplier: number;
	totalReward: number;
	leagueName: string;
	leagueRank: number;
}

export class LeagueRewardService {
	/**
	 * Calcule les récompenses Melios basées sur la ligue
	 * @param league La ligue actuelle du membre
	 * @param baseActionReward La récompense de base pour l'action effectuée
	 * @returns Le calcul détaillé des récompenses
	 */
	static calculateLeagueReward(
		league: League | null,
		baseActionReward: number = 1
	): LeagueRewardCalculation {
		if (!league) {
			return {
				baseReward: baseActionReward,
				leagueMultiplier: 1,
				totalReward: baseActionReward,
				leagueName: "Aucune",
				leagueRank: 0,
			};
		}

		// Multiplicateur très faible pour limiter les gains
		const leagueMultiplier = this.getLeagueMultiplier(league.rank);
		const totalReward = Math.round(baseActionReward * leagueMultiplier);

		return {
			baseReward: baseActionReward,
			leagueMultiplier,
			totalReward,
			leagueName: league.name,
			leagueRank: league.rank,
		};
	}

	/**
	 * Obtient le multiplicateur basé sur le rang de la ligue
	 * @param leagueRank Le rang de la ligue (1 = plus bas, plus élevé = meilleur)
	 * @returns Le multiplicateur à appliquer aux récompenses
	 */
	private static getLeagueMultiplier(leagueRank: number): number {
		// Multiplicateurs très faibles pour limiter les gains
		const multipliers: { [key: number]: number } = {
			1: 1.0, // Bronze: x1
			2: 1.05, // Argent: x1.05
			3: 1.1, // Or: x1.1
			4: 1.15, // Platine: x1.15
			5: 1.2, // Diamant: x1.2
			6: 1.25, // Maître: x1.25
			7: 1.3, // Grand Maître: x1.3
			8: 1.35, // Champion: x1.35
			9: 1.4, // Légende: x1.4
			10: 1.5, // Mythique: x1.5
		};

		// Si le rang est plus élevé que prévu, utiliser une formule progressive limitée
		if (leagueRank > 10) {
			return 1.5 + (leagueRank - 10) * 0.05;
		}

		return multipliers[leagueRank] || 1.0;
	}

	/**
	 * Calcule les récompenses quotidiennes bonus basées sur la ligue
	 * @param league La ligue actuelle
	 * @returns Les points Melios bonus quotidiens
	 */
	static calculateDailyLeagueBonus(league: League | null): number {
		if (!league) return 0;

		// Bonus quotidiens très faibles pour limiter les gains
		const dailyBonuses: { [key: number]: number } = {
			1: 0, // Bronze: pas de bonus
			2: 0, // Argent: pas de bonus
			3: 0, // Or: pas de bonus
			4: 0, // Platine: pas de bonus
			5: 0, // Diamant: pas de bonus
			6: 1, // Maître: +1 point/jour
			7: 1, // Grand Maître: +1 point/jour
			8: 1, // Champion: +1 point/jour
			9: 1, // Légende: +1 point/jour
			10: 1, // Mythique: +1 point/jour
		};

		// Bonus maximal de 1 point par jour même pour les ligues très élevées
		if (league.rank > 10) {
			return 1;
		}

		return dailyBonuses[league.rank] || 0;
	}

	/**
	 * Calcule les récompenses pour compléter une habitude
	 * @param league La ligue actuelle
	 * @param habitDifficulty La difficulté de l'habitude (1-5)
	 * @returns Le calcul des récompenses
	 */
	static calculateHabitCompletionReward(
		league: League | null,
		habitDifficulty: number = 1
	): LeagueRewardCalculation {
		// Récompense de base très faible pour les habitudes (1-2 points max)
		const baseReward = Math.min(habitDifficulty, 2);
		return this.calculateLeagueReward(league, baseReward);
	}

	/**
	 * Calcule les récompenses pour compléter un objectif
	 * @param league La ligue actuelle
	 * @param goalValue La valeur de l'objectif (optionnel)
	 * @returns Le calcul des récompenses
	 */
	static calculateGoalCompletionReward(
		league: League | null,
		goalValue: number = 50
	): LeagueRewardCalculation {
		// Récompense de base très faible pour les objectifs (1-2 points max)
		const baseReward = Math.min(Math.floor(goalValue / 50), 2);
		return this.calculateLeagueReward(league, baseReward);
	}

	/**
	 * Obtient la description du système de récompenses pour une ligue
	 * @param league La ligue
	 * @returns Description des avantages de la ligue
	 */
	static getLeagueRewardDescription(league: League | null): LeagueReward {
		if (!league) {
			return {
				meliosPoints: 0,
				multiplier: 1,
				bonusDescription: "Aucun bonus actuel",
			};
		}

		const multiplier = this.getLeagueMultiplier(league.rank);
		const dailyBonus = this.calculateDailyLeagueBonus(league);

		let description = `Multiplicateur x${multiplier.toFixed(
			2
		)} sur toutes les récompenses`;
		if (dailyBonus > 0) {
			description += ` • Bonus quotidien de ${dailyBonus} point Melios`;
		}

		return {
			meliosPoints: dailyBonus,
			multiplier,
			bonusDescription: description,
		};
	}

	/**
	 * Calcule les récompenses de fin de semaine selon le résultat
	 * @param league La ligue actuelle
	 * @param resultType Le type de résultat (promotion, maintien, relégation)
	 * @returns Le total des récompenses
	 */
	static calculateWeeklyReward(
		league: League | null,
		resultType: "promotion" | "maintained" | "relegated"
	): number {
		if (!league) return 0;

		// Récompenses de base très faibles pour les résultats hebdomadaires
		const baseReward = {
			promotion: 3, // 3 points pour une promotion
			maintained: 2, // 2 points pour un maintien
			relegated: 1, // 1 point de consolation
		};

		const multiplier = this.getLeagueMultiplier(league.rank);
		return Math.round(baseReward[resultType] * multiplier);
	}

	/**
	 * Applique les récompenses de ligue aux points du membre
	 * @param currentPoints Les points actuels du membre
	 * @param rewardCalculation Le calcul de récompense
	 * @returns Les nouveaux points
	 */
	static applyRewardToPoints(
		currentPoints: Points,
		rewardCalculation: LeagueRewardCalculation
	): Points {
		return {
			...currentPoints,
			rewards: currentPoints.rewards + rewardCalculation.totalReward,
		};
	}

	/**
	 * Formate l'affichage des récompenses pour l'UI
	 * @param calculation Le calcul de récompense
	 * @returns Texte formaté pour l'affichage
	 */
	static formatRewardDisplay(calculation: LeagueRewardCalculation): string {
		if (calculation.leagueMultiplier === 1) {
			return `+${calculation.totalReward} points Melios`;
		}

		return `+${calculation.totalReward} points Melios (${
			calculation.baseReward
		} × ${calculation.leagueMultiplier.toFixed(2)})`;
	}
}

export default LeagueRewardService;
