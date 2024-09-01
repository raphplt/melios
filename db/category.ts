import { collection, getDocs } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../types/category";

const LOCAL_STORAGE_KEY = "categoriesData";
export const LAST_FETCH_KEY = "lastFetchDate";
export const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; 

// Fonction pour récupérer tous les documents de la collection "categories"
export const getAllCategories = async (forceRefresh = false) => {
    try {
        const lastFetchDate = await AsyncStorage.getItem(LAST_FETCH_KEY);
		const now = new Date().getTime();

        if (!forceRefresh && lastFetchDate && (now - parseInt(lastFetchDate, 10)) < ONE_WEEK_IN_MS) {
            const storedCategories = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedCategories) {
                return JSON.parse(storedCategories);
            }
        }

        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
		console.log('[FETCH] - Database fetch for categories');

        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));


        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categoriesData));
        await AsyncStorage.setItem(LAST_FETCH_KEY, now.toString());

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
export const getCategoryById = async (categoryId: string) => {
    try {
        const categories = await getAllCategories();
        return categories.find((category: Category) => category.id == categoryId);
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