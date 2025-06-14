import { MemberLeague } from "../type/member";

/**
 * Utilitaires pour valider et nettoyer les données de ligue
 */
export class LeagueDataValidator {
	/**
	 * Valide et nettoie les données de ligue pour éviter les NaN
	 */
	static validateLeagueData(
		league: MemberLeague | null | undefined
	): MemberLeague | null {
		if (!league) return null;

		return {
			leagueId: league.leagueId || "",
			points: this.safeNumber(league.points, 0),
			rank: this.safeNumber(league.rank, 1),
			weeklyPoints: this.safeNumber(league.weeklyPoints, 0),
			lastWeeklyReset: league.lastWeeklyReset || new Date().toISOString(),
		};
	}

	/**
	 * Convertit une valeur en nombre sûr (évite NaN)
	 */
	static safeNumber(value: any, defaultValue: number = 0): number {
		const num = Number(value);
		return isNaN(num) || !isFinite(num) ? defaultValue : num;
	}

	/**
	 * Formate les points avec des séparateurs pour l'affichage
	 */
	static formatPoints(points: number | undefined | null): string {
		const safePoints = this.safeNumber(points, 0);
		return safePoints.toLocaleString();
	}

	/**
	 * Calcule un pourcentage sûr
	 */
	static safePercentage(
		current: number | undefined | null,
		total: number | undefined | null
	): number {
		const safeCurrent = this.safeNumber(current, 0);
		const safeTotal = this.safeNumber(total, 1);

		if (safeTotal === 0) return 0;

		const percentage = (safeCurrent / safeTotal) * 100;
		return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
	}

	/**
	 * Crée une ligue par défaut
	 */
	static createDefaultLeague(leagueId: string = ""): MemberLeague {
		return {
			leagueId,
			points: 0,
			rank: 1,
			weeklyPoints: 0,
			lastWeeklyReset: new Date().toISOString(),
		};
	}

	/**
	 * Vérifie si les données de ligue sont valides
	 */
	static isValidLeague(league: any): league is MemberLeague {
		return (
			league &&
			typeof league === "object" &&
			typeof league.leagueId === "string" &&
			typeof league.points === "number" &&
			typeof league.rank === "number" &&
			typeof league.weeklyPoints === "number" &&
			typeof league.lastWeeklyReset === "string"
		);
	}
}
