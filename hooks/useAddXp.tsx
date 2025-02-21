import { useCallback } from "react";
import { useData } from "@context/DataContext";
import { calculateNextLevelXp, updateUserLevel } from "@db/levels";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { getLevelByCategoryId } from "@utils/progressionUtils";
import { UserLevel } from "@type/levels";
import { genericLevels } from "@constants/levels";

const useAddXp = () => {
	const { usersLevels, setUsersLevels, member } = useData();
	const { categories } = useHabits();

	if (!member) {
		console.error("No member found in useAddXp");
		return null;
	}

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
				// Identifier le niveau de la catégorie spécifique
				const category = categories.find(
					(category) => category.category === habit.category
				);
				const idCategory = String(category?.id);

				const associatedLevel = getLevelByCategoryId(idCategory, genericLevels);
				const globalLevelId = "P0gwsxEYNJATbmCoOdhc"; // ID du niveau global

				// Fonction générique pour mettre à jour ou créer un niveau
				const updateOrCreateLevel = async (levelId: string, xpToAdd: number) => {
					let currentLevelData = Object.values(usersLevels).find(
						(level) => level.levelId === levelId
					);

					if (!currentLevelData) {
						// Si le niveau n'existe pas, le créer
						currentLevelData = {
							id: `${member.uid}-${levelId}`,
							levelId,
							userId: member.uid,
							currentLevel: 1,
							currentXp: 0,
							nextLevelXp: calculateNextLevelXp(1),
						};

						// Sauvegarder le niveau créé dans Firebase
						await updateUserLevel(member.uid, String(levelId), currentLevelData);

						// Mettre à jour localement
						setUsersLevels((prev: UserLevel[]) => ({
							...prev,
							[levelId]: currentLevelData,
						}));
					}

					const { currentLevel, currentXp } = currentLevelData;

					// Calculer la progression
					const updatedLevel = updateLevel(currentLevel, currentXp, xpToAdd);

					// Mettre à jour Firebase
					await updateUserLevel(member.uid, String(levelId), {
						...currentLevelData,
						...updatedLevel,
					});

					// Mettre à jour localement
					setUsersLevels((prev: UserLevel[]) => ({
						...prev,
						[levelId]: {
							...prev[levelId],
							...updatedLevel,
						},
					}));
				};

				// Mettre à jour ou créer le niveau spécifique
				if (associatedLevel) {
					await updateOrCreateLevel(associatedLevel.id, xpToAdd);
				}

				// Mettre à jour ou créer le niveau global
				await updateOrCreateLevel(globalLevelId, xpToAdd);
			} catch (error) {
				console.error("Error updating XP: ", error);
				return null;
			}
		},
		[
			updateLevel,
			usersLevels,
			setUsersLevels,
			member.uid,
			categories,
			genericLevels,
		]
	);

	return { addXp };
};

export default useAddXp;
