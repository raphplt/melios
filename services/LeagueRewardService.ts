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
		baseActionReward: number = 10
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

		// Plus la ligue est élevée (rank élevé), plus le multiplicateur est important
		// Rank 1 = première ligue (plus faible), multiplicateur minimal
		// Rank plus élevé = ligue plus élevée, multiplicateur plus élevé
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
		// Multiplicateurs progressifs basés sur le rang
		const multipliers: { [key: number]: number } = {
			1: 1.0,   // Bronze: x1
			2: 1.2,   // Argent: x1.2
			3: 1.4,   // Or: x1.4
			4: 1.6,   // Platine: x1.6
			5: 1.8,   // Diamant: x1.8
			6: 2.0,   // Maître: x2.0
			7: 2.3,   // Grand Maître: x2.3
			8: 2.6,   // Champion: x2.6
			9: 2.9,   // Légende: x2.9
			10: 3.2,  // Mythique: x3.2
		};

		// Si le rang est plus élevé que prévu, utiliser une formule progressive
		if (leagueRank > 10) {
			return 3.2 + (leagueRank - 10) * 0.2;
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

		// Bonus quotidiens progressifs
		const dailyBonuses: { [key: number]: number } = {
			1: 5,    // Bronze: +5 points/jour
			2: 8,    // Argent: +8 points/jour
			3: 12,   // Or: +12 points/jour
			4: 16,   // Platine: +16 points/jour
			5: 20,   // Diamant: +20 points/jour
			6: 25,   // Maître: +25 points/jour
			7: 30,   // Grand Maître: +30 points/jour
			8: 35,   // Champion: +35 points/jour
			9: 40,   // Légende: +40 points/jour
			10: 50,  // Mythique: +50 points/jour
		};

		if (league.rank > 10) {
			return 50 + (league.rank - 10) * 5;
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
		const baseReward = 10 * habitDifficulty; // Récompense de base selon la difficulté
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
		return this.calculateLeagueReward(league, goalValue);
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

		let description = `Multiplicateur x${multiplier.toFixed(1)} sur toutes les récompenses`;
		if (dailyBonus > 0) {
			description += ` • Bonus quotidien de ${dailyBonus} points Melios`;
		}

		return {
			meliosPoints: dailyBonus,
			multiplier,
			bonusDescription: description,
		};
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

		return `+${calculation.totalReward} points Melios (${calculation.baseReward} × ${calculation.leagueMultiplier.toFixed(1)})`;
	}
}

export default LeagueRewardService;
