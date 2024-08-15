import { addDoc, collection } from "firebase/firestore";
import { db } from ".";
import { fetchCollectionData } from "./fetch";

const LOCAL_STORAGE_TROPHIES_LIST_KEY = "trophiesList";

export const getAllTrophies = async (forceRefresh = false) => {
	return fetchCollectionData(
		"trophiesList",
		LOCAL_STORAGE_TROPHIES_LIST_KEY,
		forceRefresh
	);
};

// Fonction pour importer les trophées
// export const importTrophies = async () => {
// 	try {
// 		const trophiesCollection = collection(db, "trophiesList");
// 		await Promise.all(
// 			trophies.map(async (trophy) => {
// 				console.log(trophy);
// 				await addDoc(trophiesCollection, trophy);
// 			})
// 		);
// 		console.log("Trophées importés avec succès");
// 	} catch (error) {
// 		console.error("Erreur lors de l'importation des trophées: ", error);
// 		throw error;
// 	}
// };
