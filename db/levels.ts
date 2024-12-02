import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCollectionData } from "./fetch";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	updateDoc,
	setDoc,
	getDoc,
} from "firebase/firestore";
import { db } from ".";
import { GenericLevel } from "@type/levels";

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
		if (storedData) {
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

		if (userLevelDoc.exists()) {
			return userLevelDoc.data().levels;
		} else {
			console.log("No levels found for this user");
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
	xpToAdd: number
) => {
	try {
		const userLevelDocRef = doc(db, "usersLevels", userId);
		const userLevelDoc = await getDoc(userLevelDocRef);

		if (userLevelDoc.exists()) {
			const userLevels = userLevelDoc.data().levels;

			// Fusionner les données existantes
			const currentXp = userLevels[levelId]?.xp || 0;
			const updatedXp = currentXp + xpToAdd;

			userLevels[levelId] = {
				...(userLevels[levelId] || {}),
				xp: updatedXp,
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
) => {
	try {
		const userLevelDocRef = doc(db, "usersLevels", userId);
		const userLevelDoc = await getDoc(userLevelDocRef);

		// Si les niveaux existent déjà, ne pas réinitialiser
		if (userLevelDoc.exists()) return;

		const userLevels = genericLevels.reduce(
			(acc: { [key: string]: { xp: number } }, level) => {
				acc[level.id] = { xp: 0 };
				return acc;
			},
			{}
		);

		await setDoc(userLevelDocRef, { levels: userLevels });
	} catch (error) {
		console.error("Error initializing user levels: ", error);
		throw error;
	}
};

