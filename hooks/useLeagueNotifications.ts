import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { League } from "../type/league";

interface ProgressionNotification {
	type: "promotion" | "relegation" | "maintenance";
	oldLeague?: League;
	newLeague: League;
	pointsGained?: number;
	rewardsEarned?: number;
}

/**
 * Hook pour gérer les notifications de progression de ligue
 */
export const useLeagueNotifications = () => {
	const [lastNotification, setLastNotification] =
		useState<ProgressionNotification | null>(null);

	const showPromotionAlert = useCallback(
		(oldLeague: League, newLeague: League, pointsUsed: number) => {
			const notification: ProgressionNotification = {
				type: "promotion",
				oldLeague,
				newLeague,
				pointsGained: pointsUsed,
				rewardsEarned: 20,
			};

			setLastNotification(notification);

			Alert.alert(
				"🎉 Promotion !",
				`Félicitations ! Vous êtes passé de ${oldLeague.name} à ${newLeague.name} !\n\n` +
					`Points utilisés: ${pointsUsed}\n` +
					`Récompenses gagnées: +20 🏆`,
				[
					{
						text: "Fantastique !",
						style: "default",
					},
				]
			);
		},
		[]
	);

	const showRelegationAlert = useCallback(
		(oldLeague: League, newLeague: League) => {
			const notification: ProgressionNotification = {
				type: "relegation",
				oldLeague,
				newLeague,
				rewardsEarned: 5,
			};

			setLastNotification(notification);

			Alert.alert(
				"📉 Relégation",
				`Vous êtes descendu de ${oldLeague.name} à ${newLeague.name}.\n\n` +
					`N'oubliez pas de compléter vos objectifs hebdomadaires !\n` +
					`Récompenses de consolation: +5 🏆`,
				[
					{
						text: "Je vais faire mieux !",
						style: "default",
					},
				]
			);
		},
		[]
	);

	const showMaintenanceAlert = useCallback(
		(league: League, pointsEarned: number) => {
			const notification: ProgressionNotification = {
				type: "maintenance",
				newLeague: league,
				pointsGained: pointsEarned,
				rewardsEarned: 10,
			};

			setLastNotification(notification);

			Alert.alert(
				"✅ Objectif atteint !",
				`Bravo ! Vous maintenez votre position en ${league.name}.\n\n` +
					`Points cette semaine: ${pointsEarned}\n` +
					`Récompenses de maintien: +10 🏆`,
				[
					{
						text: "Excellent !",
						style: "default",
					},
				]
			);
		},
		[]
	);

	return {
		lastNotification,
		showPromotionAlert,
		showRelegationAlert,
		showMaintenanceAlert,
		clearNotification: () => setLastNotification(null),
	};
};
