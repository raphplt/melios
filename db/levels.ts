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
		const usersLevelsCollectionRef = collection(db, "usersLevels");

		const querySnapshot = await getDocs(
			query(usersLevelsCollectionRef, where("userId", "==", userId))
		);

		if (!querySnapshot.empty) {
			const userLevels = querySnapshot.docs.map((doc) => doc.data());
			return userLevels;
		} else {
			console.log("No levels found for this user");
			return [];
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
	newLevel: number
) => {
	try {
		const usersLevelsCollectionRef = collection(db, "usersLevels");

		const querySnapshot = await getDocs(
			query(usersLevelsCollectionRef, where("userId", "==", userId))
		);

		if (!querySnapshot.empty) {
			const userLevels = querySnapshot.docs.map((doc) => doc.data());
			const userLevel = userLevels.find((level) => level.levelId === levelId);

			if (userLevel) {
				const userLevelRef = doc(usersLevelsCollectionRef, userLevel.id);
				await updateDoc(userLevelRef, { level: newLevel });
			}
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
		const usersLevelsCollectionRef = collection(db, "usersLevels");

		const userLevels = genericLevels.map((level) => ({
			userId,
			levelId: level.id,
			xp: 0,
		}));

		await Promise.all(
			userLevels.map(async (userLevel) => {
				await setDoc(doc(usersLevelsCollectionRef), userLevel);
			})
		);
	} catch (error) {
		console.error("Error initializing user levels: ", error);
		throw error;
	}
};
