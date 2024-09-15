import { collection, getDocs } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCategoryById } from "./category";
import { Habit } from "../type/habit";
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

// Fonction pour récupérer les habitudes par catégorie
export const getHabitsByCategory = async () => {
	try {
		const habits = await getAllHabits();
		return habits.reduce((acc: any, habit: Habit) => {
			const category = habit.category;
			if (!acc[category.id]) {
				acc[category.id] = [];
			}
			acc[category.id].push(habit);
			return acc;
		}, {});
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des habitudes par catégorie: ",
			error
		);
		throw error;
	}
};

export const getHabitById = async (id: string) => {
	try {
		const startTimeInMs = new Date().getTime();

		const habits = await getAllHabits();
		const habit = habits.find((habit: Habit) => habit.id === id);
		if (habit) {
			const category = await getCategoryById(habit.category);
			const endTimeInMs = new Date().getTime();
			console.log(
				`[PERF] - getHabitById took ${endTimeInMs - startTimeInMs}ms to execute`
			);
			return { ...habit, category };
		}
		return null;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération d'un document de la collection 'habits' par son id: ",
			error
		);
		throw error;
	}
};

// Fonction pour importer les habitudes
// export const importHabits = async () => {
// 	try {
// 		const habitsCollection = collection(db, "habits");
// 		await Promise.all(
// 			habits.habits.map(async (habit) => {
// 				await addDoc(habitsCollection, habit);
// 			})
// 		);
// 		console.log("Habitudes importées avec succès");
// 	} catch (error) {
// 		console.error("Erreur lors de l'importation des habitudes: ", error);
// 		throw error;
// 	}
// };

// export const updateHabitsByName = async () => {
// 	const habitsCollection = collection(db, "habits");

// 	await Promise.all(
// 		exempleJSON.map(async (habit) => {
// 			const q = query(habitsCollection, where("name", "==", habit.name));
// 			const querySnapshot = await getDocs(q);

// 			if (!querySnapshot.empty) {
// 				const habitDoc = doc(habitsCollection, querySnapshot.docs[0].id);
// 				await updateDoc(habitDoc, { moment: habit.moment });
// 				console.log(`Document ${habit.name} updated`);
// 			}
// 		})
// 	);
// };
