import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from ".";

// Fonction pour récupérer tous les documents de la collection "categories"
export const getAllCategories = async (forceRefresh = false) => {
	try {
		const categoriesCollection = collection(db, "categories");
		const categoriesSnapshot = await getDocs(categoriesCollection);

		const categoriesData = categoriesSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return categoriesData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents de la collection 'categories': ",
			error
		);
		throw error;
	}
};

// Fonction pour récupérer une catégorie par son id
export const getCategoryById = async (categoryId: any) => {
	try {
		const categories = await getAllCategories();
		return categories.find((category) => category.id == categoryId);
	} catch (error) {
		console.error(
			"Erreur lors de la récupération d'une catégorie par son id: ",
			error
		);
		throw error;
	}
};

// Fonction pour importer les catégories
// export const importCategories = async () => {
// 	try {
// 		const categoriesCollection = collection(db, "categories");
// 		await Promise.all(
// 			categoriesData.categories.map(async (category) => {
// 				await addDoc(categoriesCollection, category);
// 			})
// 		);
// 		console.log("Catégories importées avec succès");
// 	} catch (error) {
// 		console.error("Erreur lors de l'importation des catégories: ", error);
// 		throw error;
// 	}
// };
