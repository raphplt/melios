import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from ".";

// Fonction pour récupérer tous les documents de la collection "habits"
export const getAllHabits = async () => {
	try {
		const habitsCollection = collection(db, "habits");
		const habitsSnapshot = await getDocs(habitsCollection);

		const habitsData = habitsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return habitsData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents de la collection 'habits': ",
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
