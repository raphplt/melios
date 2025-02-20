import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from ".";
import { GenericLevel, UserLevel } from "@type/levels";

/**
 * Fonction pour récupérer les niveaux d'un utilisateur
 *
 * @param userId
 * @returns
 */
export const getUserLevelsByUserId = async (userId: string) => {
	try {
		const userLevelDocRef = doc(db, "usersLevels", userId);
		const userLevelDoc = await getDoc(userLevelDocRef);

		if (userLevelDoc.exists() && userLevelDoc.data().levels) {
			return userLevelDoc.data().levels;
		} else {
			return {};
		}
	} catch (error) {
		console.error("Error fetching user levels: ", error);
		throw error;
	}
};

/**
 * Fonction pour modifier un niveau d'un utilisateur
 *
 * @param userId
 * @returns
 */
export const updateUserLevel = async (
	userId: string,
	levelId: string,
	updatedLevelData: UserLevel
) => {
	try {
		const userLevelDocRef = doc(db, "usersLevels", userId);
		const userLevelDoc = await getDoc(userLevelDocRef);

		if (userLevelDoc.exists()) {
			const userLevels = userLevelDoc.data().levels;

			userLevels[levelId] = {
				...userLevels[levelId],
				...updatedLevelData,
			};

			await updateDoc(userLevelDocRef, { levels: userLevels });
		} else {
			console.error(`No levels document found for user: ${userId}`);
		}
	} catch (error) {
		console.error("Error updating user level: ", error);
		throw error;
	}
};

/**
 * Fonction pour initialiser les niveaux d'un utilisateur
 *
 * @param userId
 * @param genericLevels
 * @returns
 */
export const initUserLevels = async (
	userId: string,
	genericLevels: GenericLevel[]
): Promise<{ [key: string]: UserLevel }> => {
	if (genericLevels.length === 0) {
		console.error("Cannot initialize user levels: genericLevels is empty");
		return {};
	}

	try {
		const userLevelDocRef = doc(db, "usersLevels", userId);
		const docSnap = await getDoc(userLevelDocRef);

		if (docSnap.exists()) {
			console.log("Document already exists for userId: ", userId);
			return docSnap.data().levels;
		}

		const userLevels = genericLevels.reduce(
			(acc: { [key: string]: UserLevel }, level) => {
				acc[level.id] = {
					id: `${userId}-${level.id}`,
					levelId: level.id,
					userId,
					currentLevel: 1,
					currentXp: 0,
					nextLevelXp: calculateNextLevelXp(1),
				};
				return acc;
			},
			{}
		);

		await setDoc(userLevelDocRef, { levels: userLevels });
		console.log("User levels initialized successfully");
		return userLevels;
	} catch (error) {
		console.error("Error initializing user levels: ", error);
		throw error;
	}
};

export const calculateNextLevelXp = (level: number): number => {
	return Math.floor(100 * Math.pow(1.5, level - 1));
};
