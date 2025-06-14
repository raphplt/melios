import { Member } from "../type/member";
import { League } from "../type/league";
import { getAllLeagues } from "../db/leagues";
import { updateMemberField } from "../db/member";
import { addRewardsToMember } from "../db/rewards";

/**
 * Service pour gérer la progression des ligues automatiquement
 */
export class LeagueProgressionService {
	/**
	 * Vérifie et applique la progression de ligue pour un membre
	 */
	static async checkAndApplyProgression(
		member: Member,
		showNotifications: boolean = true
	): Promise<Member | null> {
		if (!member.league) return null;

		try {
			const allLeagues = await getAllLeagues();
			const sortedLeagues = [...allLeagues].sort((a, b) => a.rank - b.rank);
			const currentLeagueIndex = sortedLeagues.findIndex(
				(l) => l.id === member.league!.leagueId
			);

			if (currentLeagueIndex === -1) {
				console.warn("Current league not found in leagues list");
				return null;
			}

			const currentLeague = sortedLeagues[currentLeagueIndex];
			const nextLeague = sortedLeagues[currentLeagueIndex + 1];
			const previousLeague = sortedLeagues[currentLeagueIndex - 1];

			let updatedMember = { ...member };
			let hasChanged = false;

			// Vérifier promotion
			if (nextLeague && member.league.points >= nextLeague.pointsRequired) {
				const pointsUsedForPromotion = nextLeague.pointsRequired;
				const remainingPoints = member.league.points - pointsUsedForPromotion;

				const updatedLeague = {
					...member.league,
					leagueId: nextLeague.id,
					rank: nextLeague.rank,
					points: Math.max(0, remainingPoints),
				};

				await updateMemberField("league", updatedLeague);
				await addRewardsToMember(member.uid, "rewards", 20); // Bonus promotion

				updatedMember.league = updatedLeague;
				hasChanged = true;

				console.log(
					`🎉 ${member.nom} promoted to ${nextLeague.name}! Points used: ${pointsUsedForPromotion}, Remaining: ${remainingPoints}`
				);

				// Si il reste encore assez de points pour une autre promotion, vérifier récursivement
				if (
					remainingPoints >=
					(sortedLeagues[currentLeagueIndex + 2]?.pointsRequired || Infinity)
				) {
					const furtherProgression = await this.checkAndApplyProgression(
						updatedMember,
						false
					);
					if (furtherProgression) {
						updatedMember = furtherProgression;
					}
				}
			}

			// Vérifier reset hebdomadaire
			const lastReset = new Date(member.league.lastWeeklyReset);
			const now = new Date();
			const daysSinceReset = Math.floor(
				(now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
			);

			if (daysSinceReset >= 7) {
				const hasMetWeeklyRequirement =
					member.league.weeklyPoints >= currentLeague.weeklyPointsRequired;

				let updatedLeague = {
					...updatedMember.league!,
					weeklyPoints: 0,
					lastWeeklyReset: now.toISOString(),
				};

				// Relégation si objectif hebdomadaire non atteint
				if (!hasMetWeeklyRequirement && previousLeague) {
					updatedLeague.leagueId = previousLeague.id;
					updatedLeague.rank = previousLeague.rank;
					await addRewardsToMember(member.uid, "rewards", 5); // Consolation relegation
					console.log(`📉 ${member.nom} relegated to ${previousLeague.name}`);
				} else if (hasMetWeeklyRequirement) {
					await addRewardsToMember(member.uid, "rewards", 10); // Bonus maintien
					console.log(`✅ ${member.nom} maintained league position`);
				}

				await updateMemberField("league", updatedLeague);
				updatedMember.league = updatedLeague;
				hasChanged = true;
			}

			return hasChanged ? updatedMember : null;
		} catch (error) {
			console.error("Error in league progression:", error);
			return null;
		}
	}

	/**
	 * Vérifie uniquement la promotion (pas la relégation) - à utiliser après ajout de points
	 */
	static async checkPromotionOnly(member: Member): Promise<Member | null> {
		if (!member.league) return null;

		try {
			const allLeagues = await getAllLeagues();
			const sortedLeagues = [...allLeagues].sort((a, b) => a.rank - b.rank);
			const currentLeagueIndex = sortedLeagues.findIndex(
				(l) => l.id === member.league!.leagueId
			);

			if (currentLeagueIndex === -1) {
				console.warn(
					"Current league not found, member league ID:",
					member.league.leagueId
				);
				return null;
			}

			const currentLeague = sortedLeagues[currentLeagueIndex];
			const nextLeague = sortedLeagues[currentLeagueIndex + 1];

			console.log(`Checking promotion for ${member.nom}:`);
			console.log(
				`Current league: ${currentLeague.name} (rank ${currentLeague.rank})`
			);
			console.log(`Current points: ${member.league.points}`);
			console.log(
				`Next league: ${nextLeague?.name || "None"} (requires ${
					nextLeague?.pointsRequired || "N/A"
				})`
			);

			// Vérifier promotion uniquement
			if (nextLeague && member.league.points >= nextLeague.pointsRequired) {
				console.log(
					`🎯 PROMOTION TRIGGERED! ${member.league.points} >= ${nextLeague.pointsRequired}`
				);

				// Points restants après promotion = points actuels - seuil de la nouvelle ligue
				const remainingPoints = member.league.points - nextLeague.pointsRequired;

				const updatedLeague = {
					...member.league,
					leagueId: nextLeague.id,
					rank: nextLeague.rank,
					points: Math.max(0, remainingPoints),
				};

				await updateMemberField("league", updatedLeague);
				await addRewardsToMember(member.uid, "rewards", 20); // Bonus promotion

				const updatedMember = { ...member, league: updatedLeague };

				console.log(
					`✅ PROMOTION COMPLETE: ${currentLeague.name} → ${nextLeague.name}`
				);
				console.log(`Points after promotion: ${remainingPoints}`);

				// Vérifier s'il peut encore monter (promotion multiple)
				const nextNextLeague = sortedLeagues[currentLeagueIndex + 2];
				if (nextNextLeague && remainingPoints >= nextNextLeague.pointsRequired) {
					console.log(`🔄 Checking for additional promotion...`);
					return await this.checkPromotionOnly(updatedMember);
				}

				return updatedMember;
			} else {
				console.log(
					`❌ No promotion: ${member.league.points} < ${
						nextLeague?.pointsRequired || "N/A"
					}`
				);
			}

			return null; // Pas de promotion
		} catch (error) {
			console.error("Error in promotion check:", error);
			return null;
		}
	}

	/**
	 * Calcule les statistiques d'une ligue
	 */
	static calculateLeagueStats(leagues: League[], currentLeague: League) {
		const currentIndex = leagues.findIndex((l) => l.id === currentLeague.id);
		const nextLeague =
			currentIndex < leagues.length - 1 ? leagues[currentIndex + 1] : null;
		const previousLeague = currentIndex > 0 ? leagues[currentIndex - 1] : null;

		return {
			nextLeague,
			previousLeague,
			isLowestLeague: currentIndex === 0,
			isHighestLeague: currentIndex === leagues.length - 1,
			totalLeagues: leagues.length,
			position: currentIndex + 1,
		};
	}

	/**
	 * Formate les points avec des séparateurs de milliers
	 */
	static formatPoints(points: number): string {
		return points.toLocaleString();
	}

	/**
	 * Calcule le temps restant avant le reset hebdomadaire
	 */
	static getTimeUntilWeeklyReset(lastReset: string): {
		days: number;
		hours: number;
		minutes: number;
	} {
		const lastResetDate = new Date(lastReset);
		const nextReset = new Date(lastResetDate);
		nextReset.setDate(nextReset.getDate() + 7);

		const now = new Date();
		const diff = nextReset.getTime() - now.getTime();

		if (diff <= 0) {
			return { days: 0, hours: 0, minutes: 0 };
		}

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return { days, hours, minutes };
	}
}
