import { Habit } from "@type/habit";
import {
	collection,
	setDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { auth, db } from ".";
import { FieldValues } from "react-hook-form";

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

export const getUserHabitsByMemberId = async (memberId: string) => {
	try {
		const userHabitsCollectionRef = collection(db, "userHabits");

		const q = query(userHabitsCollectionRef, where("memberId", "==", memberId));

		const querySnapshot = await getDocs(q);

		const userHabits = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		console.log("userHabits", userHabits);

		return userHabits;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des documents dans la collection 'userHabits': ",
			error
		);
		throw error;
	}
};