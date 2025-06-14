import { useState, useCallback, useRef, useEffect } from "react";
import { League } from "../type/league";
import { Member } from "../type/member";
import { getLeagueById } from "../db/leagues";

interface PromotionEvent {
	oldLeague: League | null;
	newLeague: League;
	member: Member;
	timestamp: number;
}

/**
 * Hook global pour gérer les événements de promotion
 */
export const useGlobalPromotion = () => {
	const [currentPromotion, setCurrentPromotion] =
		useState<PromotionEvent | null>(null);
	const [isPromotionVisible, setIsPromotionVisible] = useState(false);
	const promotionQueue = useRef<PromotionEvent[]>([]);

	const triggerPromotion = useCallback(
		async (oldMember: Member, newMember: Member) => {
			if (!oldMember.league || !newMember.league) return;

			// Vérifier si il y a eu une vraie promotion
			if (oldMember.league.leagueId === newMember.league.leagueId) return;

			try {
				const oldLeague = await getLeagueById(oldMember.league.leagueId);
				const newLeague = await getLeagueById(newMember.league.leagueId);

				if (!newLeague) return;

				const promotionEvent: PromotionEvent = {
					oldLeague,
					newLeague,
					member: newMember,
					timestamp: Date.now(),
				};

				// Ajouter à la queue
				promotionQueue.current.push(promotionEvent);

				// Si aucune promotion n'est actuellement affichée, déclencher l'affichage
				if (!isPromotionVisible) {
					processPromotionQueue();
				}
			} catch (error) {
				console.error("Error triggering promotion:", error);
			}
		},
		[isPromotionVisible]
	);

	const processPromotionQueue = useCallback(() => {
		if (promotionQueue.current.length === 0) return;

		const nextPromotion = promotionQueue.current.shift();
		if (nextPromotion) {
			setCurrentPromotion(nextPromotion);
			setIsPromotionVisible(true);
		}
	}, []);

	const dismissPromotion = useCallback(() => {
		setIsPromotionVisible(false);
		setCurrentPromotion(null);

		// Traiter la prochaine promotion dans la queue après un délai
		setTimeout(() => {
			processPromotionQueue();
		}, 500);
	}, [processPromotionQueue]);

	return {
		currentPromotion,
		isPromotionVisible,
		triggerPromotion,
		dismissPromotion,
	};
};
