import {
	collection,
	doc,
	setDoc,
	getDocs,
	query,
	where,
	deleteDoc,
} from "firebase/firestore";
import { auth, db } from ".";
import { FieldValues } from "react-hook-form";

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
	} catch (error) {
		console.error(
			"Erreur lors de l'ajout du document dans la collection 'userHabits': ",
			error
		);
		throw error;
	}
};

// Fonction pour récupérer les habitudes par membre
export const getUserHabitsByMemberId = async (memberId: string) => {
	try {
		const userHabitsCollectionRef = collection(db, "userHabits");

		const q = query(userHabitsCollectionRef, where("memberId", "==", memberId));

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
