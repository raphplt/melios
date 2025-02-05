import { collection, getDocs } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LAST_FETCH_KEY, ONE_WEEK_IN_MS } from "./category";

const LOCAL_STORAGE_KEY = "habitsData";

// Fonction pour récupérer tous les documents de la collection "habits"
export const getAllHabits = async (forceRefresh = false) => {
	try {
		const now = new Date().getTime();
		const lastFetchDate = await AsyncStorage.getItem(LAST_FETCH_KEY);

		if (
			!forceRefresh &&
			lastFetchDate &&
			now - parseInt(lastFetchDate, 10) < ONE_WEEK_IN_MS
		) {
			const storedHabits = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);

			if (storedHabits) {
				return JSON.parse(storedHabits);
			}
		}

		const habitsCollection = collection(db, "habits");
		const habitsSnapshot = await getDocs(habitsCollection);
		console.log("[FETCH] - Database fetch for habits");

		const habitsData = habitsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habitsData));
		await AsyncStorage.setItem(LAST_FETCH_KEY, now.toString());

		return habitsData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents de la collection 'habits': ",
			error
		);
		throw error;
	}
};
