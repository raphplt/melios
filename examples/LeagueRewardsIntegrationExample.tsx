// Exemple d'utilisation du système de récompenses de ligue
// Ce fichier peut être utilisé comme référence pour intégrer les récompenses 
// dans d'autres parties de l'application (complétion d'habitudes, objectifs, etc.)

import { useLeagueRewards } from "../hooks/useLeagueRewards";

// Exemple d'utilisation dans un composant d'habitude
export const ExampleHabitCompletionWithLeagueRewards = () => {
	const { applyLeagueReward, formatReward } = useLeagueRewards();

	const completeHabit = async (habitDifficulty: number) => {
		try {
			// Compléter l'habitude (logique existante)
			// ...existing habit completion logic...

			// Appliquer les récompenses de ligue
			const rewardCalculation = await applyLeagueReward("habit", 10, habitDifficulty);
			
			if (rewardCalculation) {
				// Afficher une notification de récompense
				console.log("Récompense obtenue:", formatReward(rewardCalculation));
				
				// TODO: Afficher une toast notification ou modal de récompense
				// showRewardNotification(rewardCalculation);
			}
		} catch (error) {
			console.error("Error completing habit:", error);
		}
	};

	// Exemple d'utilisation dans la complétion d'objectifs
	const completeGoal = async (goalValue: number) => {
		try {
			// Compléter l'objectif (logique existante)
			// ...existing goal completion logic...

			// Appliquer les récompenses de ligue
			const rewardCalculation = await applyLeagueReward("goal", goalValue);
			
			if (rewardCalculation) {
				console.log("Récompense d'objectif:", formatReward(rewardCalculation));
			}
		} catch (error) {
			console.error("Error completing goal:", error);
		}
	};

	// Exemple de bonus quotidien
	const claimDailyBonus = async () => {
		try {
			const rewardCalculation = await applyLeagueReward("daily");
			
			if (rewardCalculation) {
				console.log("Bonus quotidien réclamé:", formatReward(rewardCalculation));
			}
		} catch (error) {
			console.error("Error claiming daily bonus:", error);
		}
	};

	// Le composant retournerait l'interface utilisateur appropriée
	return null;
};

// Instructions d'intégration:
// 1. Importez useLeagueRewards dans vos composants d'habitudes/objectifs
// 2. Appelez applyLeagueReward après la complétion d'une action
// 3. Utilisez formatReward pour afficher les récompenses à l'utilisateur
// 4. Intégrez le bonus quotidien dans votre système de récompenses quotidiennes
