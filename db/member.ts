import {
	getDocs,
	query,
	where,
	collection,
	doc,
	setDoc,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";

export const setMemberHabit = async (habit: any) => {
	try {
		// Récupérer l'uid de l'utilisateur connecté via auth
		const uid: any = auth.currentUser?.uid;

		console.log(uid);

		// Référence à la collection 'members'
		const membersCollectionRef = collection(db, "members");

		// Créer une requête pour récupérer le membre avec le champ 'uid' correspondant
		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			// Le membre existe, récupérer le premier document correspondant (il devrait y en avoir qu'un)
			const memberDoc = querySnapshot.docs[0];
			// Mettre à jour le tableau "habits" du document membre
			await updateDoc(memberDoc.ref, {
				habits: arrayUnion(habit),
			});
		} else {
			// Si le membre n'existe pas, le créer avec le tableau "habits"

			await setDoc(doc(membersCollectionRef, uid), {
				uid: uid,
				habits: [habit],
			});
			console.log("Document membre créé avec succès");
		}
	} catch (error) {
		console.error(
			"Erreur lors de l'ajout du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const getMemberHabits = async () => {
	try {
		// Récupérer l'uid de l'utilisateur connecté via auth
		const uid: any = auth.currentUser?.uid;

		// Référence à la collection 'members'
		const membersCollectionRef = collection(db, "members");

		// Créer une requête pour récupérer le membre avec le champ 'uid' correspondant
		if (uid === undefined) {
			return [];
		}
		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			// Le membre existe, récupérer le premier document correspondant (il devrait y en avoir qu'un)
			const memberDoc = querySnapshot.docs[0];

			// Récupérer le tableau "habits" du document membre
			const habits = memberDoc.data().habits;

			// Renvoyer le tableau "habits"
			return habits;
		} else {
			// Si le membre n'existe pas, renvoyer un tableau vide
			return [];
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const getMemberHabit = async (habitId: any) => {
	try {
		// Récupérer l'uid de l'utilisateur connecté via auth
		const uid: any = auth.currentUser?.uid;

		// Référence à la collection 'members'
		const membersCollectionRef = collection(db, "members");

		// Créer une requête pour récupérer le membre avec le champ 'uid' correspondant
		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			// Le membre existe, récupérer le premier document correspondant (il devrait y en avoir qu'un)
			const memberDoc = querySnapshot.docs[0];

			// Récupérer le tableau "habits" du document membre
			const habits = memberDoc.data().habits;

			// Récupérer le document habit correspondant
			const habit = habits.find((habit: any) => habit.id === habitId);

			// Renvoyer le document habit
			return habit;
		} else {
			// Si le membre n'existe pas, renvoyer un tableau vide
			return [];
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};
