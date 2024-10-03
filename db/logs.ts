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
import { db, auth } from ".";

export const setHabitLog = async (habitId: string, logDate: string) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("[SET] -Identifiant de l'habitude manquant");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			const newLogDocRef = doc(logsCollectionRef);

			await setDoc(newLogDocRef, {
				uid: uid,
				habitId: habitId,
				logs: [logDate],
				createdAt: serverTimestamp(),
			});

			console.log("Nouveau log créé avec succès pour cette habitude.");
		} else {
			const logDoc = querySnapshot.docs[0];
			const logDocRef = doc(db, "habitsLogs", logDoc.id);

			await updateDoc(logDocRef, {
				logs: [...logDoc.data().logs, logDate],
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
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("[GET] - Identifiant de l'habitude manquant");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			// console.log("Aucun log trouvé pour cette habitude.");
			return null;
		}

		const logDoc = querySnapshot.docs[0];
		const habitLogs = logDoc.data().logs;

		return habitLogs;
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};

export const getAllHabitLogs = async ({
	signal,
	forceRefresh,
}: {
	signal?: AbortSignal;
	forceRefresh?: boolean;
}) => {
	try {
		if (signal?.aborted) {
			throw new Error("Requête annulée");
		}

		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(logsCollectionRef, where("uid", "==", uid));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			console.log("Aucun log trouvé pour cet utilisateur.");
			return [];
		}

		const allLogs = querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return { habitId: data.habitId, logs: data.logs, id: doc.id };
		});

		return allLogs;
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};