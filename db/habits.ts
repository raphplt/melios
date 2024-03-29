import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_STORAGE_KEY = "habitsData";

// Fonction pour récupérer tous les documents de la collection "habits"
export const getAllHabits = async () => {
	try {
		const storedHabits = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);

		if (storedHabits) {
			console.log("Récupération des habitudes depuis le local storage...");
			return JSON.parse(storedHabits);
		}

		const habitsCollection = collection(db, "habits");
		const habitsSnapshot = await getDocs(habitsCollection);

		const habitsData = habitsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habitsData));
		return habitsData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents de la collection 'habits': ",
			error
		);
		throw error;
	}
};

// Fonction pour récupérer un document de la collection "habits" par son id
export const getHabitById = async (id : any) => {
	try {
		const habits = await getAllHabits();
		return habits.find((habit: any) => habit.id === id);
	} catch (error) {
		console.error(
			"Erreur lors de la récupération d'un document de la collection 'habits' par son id: ",
			error
		);
		throw error;
	}
};

// export const importHabits = async () => {
// 	try {
// 		const habitsCollection = collection(db, "habits");
// 		await Promise.all(
// 			exempleJSON.map(async (habit) => {
// 				await addDoc(habitsCollection, habit);
// 			})
// 		);
// 	} catch (error) {
// 		console.error(
// 			"Erreur lors de l'import des documents dans la collection 'habits': ",
// 			error
// 		);
// 		throw error;
// 	}
// };
