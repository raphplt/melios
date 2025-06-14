import { useState } from "react";
import { Alert } from "react-native";
import { Member } from "../type/member";
import { useLeaguePoints } from "./useLeaguePoints";
import { getLeagueById } from "../db/leagues";

/**
 * Hook qui combine l'ajout de points avec les notifications de promotion
 */
export const useLeaguePointsWithPromotion = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const { addPointsToMemberLeague } = useLeaguePoints();

	const addPointsAndCheckPromotion = async (
		member: Member | null,
		points: number,
		setMember?: (member: Member) => void
	) => {
		if (!member?.uid || isProcessing) return;

		setIsProcessing(true);
		try {
			// Sauvegarder l'état avant pour détecter les promotions
			const memberBefore = { ...member };
			const oldLeagueId = memberBefore.league?.leagueId;
			const oldPoints = memberBefore.league?.points || 0;

			// Ajouter les points et vérifier la promotion
			const updatedMember = await addPointsToMemberLeague(
				member,
				points,
				setMember
			);

			if (!updatedMember) return;

			// Vérifier si il y a eu une promotion
			const newLeagueId = updatedMember.league?.leagueId;
			const newPoints = updatedMember.league?.points || 0;

			if (oldLeagueId && newLeagueId && oldLeagueId !== newLeagueId) {
				// Il y a eu une promotion !
				try {
					const oldLeague = await getLeagueById(oldLeagueId);
					const newLeague = await getLeagueById(newLeagueId);

					if (oldLeague && newLeague) {
						// Calculer les points utilisés pour la promotion
						const pointsUsedForPromotion = newLeague.pointsRequired;

						console.log(
							`🎉 PROMOTION DETECTED: ${oldLeague.name} → ${newLeague.name}`
						);
						console.log(`Points before: ${oldPoints}, Points after: ${newPoints}`);
						console.log(`Points used for promotion: ${pointsUsedForPromotion}`);

						// Afficher la notification de promotion
						Alert.alert(
							"🎉 PROMOTION !",
							`Félicitations ! Vous êtes passé de ${oldLeague.name} à ${newLeague.name} !\n\n` +
								`Points utilisés: ${pointsUsedForPromotion}\n` +
								`Points restants: ${newPoints}\n` +
								`Récompenses gagnées: +20 🏆`,
							[
								{
									text: "Fantastique !",
									style: "default",
								},
							]
						);
					}
				} catch (error) {
					console.error("Error showing promotion notification:", error);
				}
			} else {
				console.log(`Points added: +${points}. Total: ${newPoints}`);
			}

			return updatedMember;
		} catch (error) {
			console.error("Error in addPointsAndCheckPromotion:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		addPointsAndCheckPromotion,
		isProcessing,
	};
};
