import {
	collection,
	doc,
	setDoc,
	getDocs,
	query,
	where,
	deleteDoc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from ".";
import { FieldValues } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LOCAL_STORAGE_MEMBER_HABITS_KEY = "memberHabits";

// Fonction pour ajouter une habitude
export const setMemberHabit = async (habit: FieldValues) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const userHabitsCollectionRef = collection(db, "userHabits");

		const habitDocRef = doc(userHabitsCollectionRef);

		await setDoc(habitDocRef, {
			uid: uid,
			...habit,
		});

		console.log("Document userHabit créé avec succès");

		return { id: habitDocRef.id, ...habit };
	} catch (error) {
		console.error(
			"Erreur lors de l'ajout du document dans la collection 'userHabits': ",
			error
		);
		throw error;
	}
};

// Fonction pour récupérer les habitudes par membre
export const getUserHabits = async (options: {
	signal?: AbortSignal;
	forceRefresh?: boolean;
}) => {
	try {
		if (!options.forceRefresh) {
			const storedData = await AsyncStorage.getItem(
				LOCAL_STORAGE_MEMBER_HABITS_KEY
			);
			if (storedData) return JSON.parse(storedData);
		}

		const uid: any = auth.currentUser?.uid;

		if (options.signal?.aborted) {
			throw new Error("Get member habits request was aborted");
		}

		const userHabitsCollectionRef = collection(db, "userHabits");

		const q = query(userHabitsCollectionRef, where("memberId", "==", uid));

		const querySnapshot = await getDocs(q);

		const userHabits = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return userHabits;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents dans la collection 'userHabits': ",
			error
		);
		throw error;
	}
};

// Fonction pour supprimer une habitude par ID
export const deleteHabitById = async (habitId: string) => {
	try {
		const habitDocRef = doc(db, "userHabits", habitId);
		await deleteDoc(habitDocRef);
		console.log(`Habitude avec l'ID ${habitId} supprimée avec succès`);
	} catch (error) {
		console.error("Erreur lors de la suppression de l'habituation: ", error);
		throw error;
	}
};

// Fonction pour récupérer une habitude par ID
export const getHabitById = async (habitId: string) => {
	try {
		const habitDocRef = doc(db, "userHabits", habitId);
		const habitDoc = await getDoc(habitDocRef);

		if (!habitDoc.exists()) {
			console.log("Aucun document trouvé pour cet ID :", habitId);
			return null;
		}

		return { id: habitDoc.id, ...habitDoc.data() };
	} catch (error) {
		console.error("Erreur lors de la récupération de l'habitude: ", error);
		throw error;
	}
};

export const resetHabit = async (habitId: string) => {
	try {
		const habitDocRef = doc(db, "userHabits", habitId);
		await updateDoc(habitDocRef, {
			resetAt: new Date(),
		});
		console.log(`Habitude avec l'ID ${habitId} réinitialisée avec succès`);
	} catch (error) {
		console.error("Erreur lors de la réinitialisation de l'habitude: ", error);
		throw error;
	}
};

// Fonction pour mettre à jour une habitude

export const updateMemberHabit = async (habit: FieldValues) => {
	try {
		const habitDocRef = doc(db, "userHabits", habit.habitId);
		await updateDoc(habitDocRef, {
			...habit,
		});
		console.log("Document userHabit mis à jour avec succès");

		return { id: habit.habitId, ...habit };
	} catch (error) {
		console.error(
			"Erreur lors de la mise à jour du document dans la collection 'userHabits': ",
			error
		);
		throw error;
	}
};
