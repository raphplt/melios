import {
	collection,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	where,
	query,
	getDocs,
} from "firebase/firestore";
import { db, auth } from "."; // Assure-toi que l'auth est bien importé

export const setHabitLog = async (habitId: string, logDate: string) => {
	try {
		const uid = auth.currentUser?.uid; // Récupère l'ID de l'utilisateur connecté
		if (!uid) throw new Error("Utilisateur non authentifié");

		// Référence vers la collection des logs
		const logsCollectionRef = collection(db, "habitsLogs");

		// Vérifier si un log existe déjà pour cet habit et cet utilisateur
		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			// Si aucun log n'existe, on crée un nouveau document de log
			const newLogDocRef = doc(logsCollectionRef); // Crée un nouveau doc avec un ID auto-généré

			await setDoc(newLogDocRef, {
				uid: uid,
				habitId: habitId,
				logs: [logDate], // Initialise avec la première date de log
				createdAt: serverTimestamp(),
			});

			console.log("Nouveau log créé avec succès pour cette habitude.");
		} else {
			// Si un log existe déjà, on met à jour la liste des logs
			const logDoc = querySnapshot.docs[0]; // Récupère le premier document correspondant
			const logDocRef = doc(db, "habitsLogs", logDoc.id);

			// Mettre à jour le document avec la nouvelle date de log
			await updateDoc(logDocRef, {
				logs: [...logDoc.data().logs, logDate], // Ajoute la nouvelle date aux logs existants
				updatedAt: serverTimestamp(),
			});

			console.log("Log mis à jour avec succès.");
		}
	} catch (error) {
		console.error("Erreur lors de l'ajout ou de la mise à jour du log :", error);
		throw error;
	}
};

export const getHabitLogs = async (habitId: string) => {
	try {
		const uid = auth.currentUser?.uid; // Récupère l'ID de l'utilisateur connecté
		if (!uid) throw new Error("Utilisateur non authentifié");

		// Référence vers la collection des logs
		const logsCollectionRef = collection(db, "habitsLogs");

		// Requête pour trouver les logs correspondant à l'utilisateur et à l'habitude
		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		// Exécuter la requête pour récupérer les logs
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			console.log("Aucun log trouvé pour cette habitude.");
			return null; // Aucun log trouvé pour cette habitude
		}

		// Récupère les logs du premier document correspondant
		const logDoc = querySnapshot.docs[0];
		const habitLogs = logDoc.data().logs;

		console.log("Logs récupérés avec succès :", habitLogs);
		return habitLogs; // Retourne la liste des logs
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};
