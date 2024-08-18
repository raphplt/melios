import { addDoc, collection } from "firebase/firestore";
import { db } from ".";
import { fetchCollectionData } from "./fetch";

const LOCAL_STORAGE_TROPHIES_LIST_KEY = "trophiesList";

export const getAllTrophies = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	if (!options.forceRefresh) {
		const storedData = localStorage.getItem(LOCAL_STORAGE_TROPHIES_LIST_KEY);
		if (storedData) {
			return JSON.parse(storedData);
		}
	}

	return fetchCollectionData(
		"trophiesList",
		LOCAL_STORAGE_TROPHIES_LIST_KEY,
		options.forceRefresh || false
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
