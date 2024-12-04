import { useCallback } from "react";
import { useData } from "@context/DataContext";
import { useSession } from "@context/UserContext";
import { calculateNextLevelXp, updateUserLevel } from "@db/levels";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { getLevelByCategoryId } from "@utils/progressionUtils";
import { UserLevel } from "@type/levels";

const useAddXp = () => {
	const { usersLevels, setUsersLevels, genericLevels } = useData();
	const { user } = useSession();
	const { categories } = useHabits();

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
		async (habit: UserHabit, xpToAdd: number) => {
			try {
				const category = categories.find(
					(category) => category.category === habit.category
				);
				const idCategory = String(category?.id);

				const associatedLevel = getLevelByCategoryId(idCategory, genericLevels);

				if (!associatedLevel) {
					console.log("No associated level found for idCategory:", idCategory);
					console.log("genericLevels:", genericLevels);
					return null;
				}

				const levelId: string = associatedLevel.id;

				const currentLevelData = Object.values(usersLevels).find(
					(level) => level.levelId === levelId
				);

				if (!currentLevelData) {
					console.log("No current level data found for levelId:", levelId);
					return null;
				}

				const { currentLevel, currentXp } = currentLevelData;

				// Calculer la progression
				const updatedLevel = updateLevel(currentLevel, currentXp, xpToAdd);

				// Met à jour Firebase
				await updateUserLevel(user.uid, String(levelId), {
					...currentLevelData,
					...updatedLevel,
				});

				// Met à jour localement
				setUsersLevels((prev: UserLevel[]) => ({
					...prev,
					[levelId]: {
						...prev[levelId as any], //TODO : la conversion en number ne fonctionne pas ?
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