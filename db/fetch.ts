import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from ".";

const LOCAL_STORAGE_HABITS_KEY = "habits";
const LOCAL_STORAGE_CATEGORIES_KEY = "categories";

const fetchCollectionData = async (
	collectionName: any,
	storageKey: any,
	forceRefresh: any
) => {
	try {
		if (!forceRefresh) {
			const storedData = await AsyncStorage.getItem(storageKey);
			if (storedData) {
				return JSON.parse(storedData);
			}
		}

		const collectionRef = collection(db, collectionName);
		const snapshot = await getDocs(collectionRef);

		const data = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		await AsyncStorage.setItem(storageKey, JSON.stringify(data));
		return data;
	} catch (error) {
		console.error(
			`Erreur lors de la récupération des documents de la collection '${collectionName}': `,
			error
		);
		throw error;
	}
};

export const getAllHabits = async (forceRefresh = false) => {
	return fetchCollectionData("habits", LOCAL_STORAGE_HABITS_KEY, forceRefresh);
};

export const getAllCategories = async (forceRefresh = false) => {
	return fetchCollectionData(
		"categories",
		LOCAL_STORAGE_CATEGORIES_KEY,
		forceRefresh
	);
};

//Fonction pour récupérer et associer les habitudes et les catégories
export const getHabitsWithCategories = async (forceRefresh = false) => {
	try {
		const [habits, categories] = await Promise.all([
			getAllHabits(forceRefresh),
			getAllCategories(forceRefresh),
		]);

		// Associer les catégories aux habitudes
		const categoriesMap = categories.reduce((acc: any, category: any) => {
			acc[category.id] = category;
			return acc;
		}, {});

		const habitsWithCategories = habits.map((habit: any) => ({
			...habit,
			category: categoriesMap[habit.category],
		}));

		return habitsWithCategories;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des habitudes avec leurs catégories associées: ",
			error
		);
		throw error;
	}
};
