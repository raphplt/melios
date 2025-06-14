import { addLeaguePoints } from "../db/member";
import { Member } from "../type/member";
import { LeagueProgressionService } from "../services/LeagueProgressionService";
import { CacheManager } from "../utils/CacheManager";

/**
 * Hook pour gérer l'ajout de points de ligue
 * À utiliser quand un utilisateur complète une habitude, session de travail, etc.
 */
export const useLeaguePoints = (
	onPromotion?: (oldMember: Member, newMember: Member) => void
) => {
	const addPointsToMemberLeague = async (
		member: Member | null,
		points: number,
		setMember?: (member: Member) => void
	) => {
		if (!member?.uid) return;

		try {
			// Sauvegarder l'état précédent pour détecter les promotions
			const memberBefore = { ...member };

			// Ajouter les points
			const updatedLeague = await addLeaguePoints(member.uid, points);
			const memberWithUpdatedLeague = { ...member, league: updatedLeague };

			// Vérifier la promotion immédiatement après ajout de points
			const promotedMember = await LeagueProgressionService.checkPromotionOnly(
				memberWithUpdatedLeague
			);

			const finalMember = promotedMember || memberWithUpdatedLeague;

			// Mettre à jour le cache pour assurer la persistance
			await CacheManager.updateMemberCache({ league: finalMember.league });

			if (setMember) {
				setMember(finalMember);
			}

			// Déclencher l'événement de promotion si il y en a eu une
			if (promotedMember && onPromotion) {
				onPromotion(memberBefore, promotedMember);
			}

			if (promotedMember) {
				console.log(
					`🎉 PROMOTION TRIGGERED! Player promoted after gaining ${points} points`
				);
			} else {
				console.log(
					`Added ${points} league points. Total: ${finalMember.league?.points || 0}`
				);
			}

			return finalMember;
		} catch (error) {
			console.error("Error adding league points:", error);
		}
	};

	return { addPointsToMemberLeague };
};
