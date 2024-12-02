import { useCallback } from "react";
import { useData } from "@context/DataContext";
import { useSession } from "@context/UserContext";
import { calculateNextLevelXp, updateUserLevel } from "@db/levels";

const useAddXp = () => {
	const { usersLevels, setUsersLevels } = useData();
	const { user } = useSession();

	const updateLevel = useCallback(
		(currentLevel: number, currentXp: number, xpToAdd: number) => {
			let newXp = currentXp + xpToAdd;
			let newLevel = currentLevel;
			let nextLevelXp = calculateNextLevelXp(newLevel);

			while (newXp >= nextLevelXp) {
				newXp -= nextLevelXp;
				newLevel += 1;
				nextLevelXp = calculateNextLevelXp(newLevel);
			}

			return {
				currentLevel: newLevel,
				currentXp: newXp,
				nextLevelXp: nextLevelXp,
			};
		},
		[]
	);

	const addXp = useCallback(
		async (levelId: any, xpToAdd: number) => {
			try {
				const currentLevelData = usersLevels[levelId];
				const { currentLevel, currentXp } = currentLevelData;

				// Calculer la progression
				const updatedLevel = updateLevel(currentLevel, currentXp, xpToAdd);

				// Met à jour Firebase
				await updateUserLevel(user.uid, levelId, {
					...currentLevelData,
					...updatedLevel,
				});

				// Met à jour localement
				setUsersLevels((prev) => ({
					...prev,
					[levelId]: {
						...prev[levelId],
						...updatedLevel,
					},
				}));
			} catch (error) {
				console.error("Error updating XP: ", error);
			}
		},
		[updateLevel, usersLevels, setUsersLevels, user.uid]
	);

	return { addXp };
};

export default useAddXp;
