import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCollectionData } from "./fetch";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from ".";
import { GenericLevel, UserLevel } from "@type/levels";

const LOCAL_STORAGE_GENERIC_LEVELS_ICONS_KEY = "genericLevels";

/**
 * 	Fonction pour récupérer tous les niveaux génériques
 *
 * @param options
 * @returns
 */
export const getAllGenericLevels = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	if (!options.forceRefresh) {
		const storedData = await AsyncStorage.getItem(
			LOCAL_STORAGE_GENERIC_LEVELS_ICONS_KEY
		);
		if (storedData && Object.keys(JSON.parse(storedData)).length > 0) {
			return JSON.parse(storedData);
		}
	}

	return fetchCollectionData(
		"genericLevels",
		LOCAL_STORAGE_GENERIC_LEVELS_ICONS_KEY,
		options.forceRefresh || false
	);
};

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
			return docSnap.data().levels; // Retourne les niveaux existants
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