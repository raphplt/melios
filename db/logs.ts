import {
	collection,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	where,
	query,
	getDocs,
	limit,
	orderBy,
	startAfter,
} from "firebase/firestore";
import { db, auth } from ".";
import { getMemberInfos, getMemberProfileByUid } from "./member";
import { getHabitById } from "./userHabit";

/**
 *  Ajoute un log pour une habitude donnée
 * @param habitId
 * @param logDate
 */
export const setHabitLog = async (habitId: string, logDate: string) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("[SET] - Identifiant de l'habitude manquant");

		const logsCollectionRef = collection(db, "habitsLogs");

		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		const logDateObj = new Date(logDate);

		if (querySnapshot.empty) {
			const newLogDocRef = doc(logsCollectionRef);

			await setDoc(newLogDocRef, {
				uid: uid,
				habitId: habitId,
				logs: [logDate],
				mostRecentLog: logDateObj.toISOString(),
				createdAt: serverTimestamp(),
			});
		} else {
			const logDoc = querySnapshot.docs[0];
			const logDocRef = doc(db, "habitsLogs", logDoc.id);

			const existingLogs = logDoc.data().logs || [];
			const updatedLogs = [...existingLogs, logDate].map((date) => new Date(date));
			const mostRecentLog = updatedLogs
				.sort((a, b) => b.getTime() - a.getTime())[0]
				.toISOString();

			await updateDoc(logDocRef, {
				logs: [...existingLogs, logDate],
				mostRecentLog,
				updatedAt: serverTimestamp(),
			});

			console.log("Log mis à jour avec succès.");
		}
	} catch (error) {
		console.error("Erreur lors de l'ajout ou de la mise à jour du log :", error);
		throw error;
	}
};

/**
 * Récupère les logs pour une habitude donnée
 * @param habitId
 * @returns
 */
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

export const getAllUsersLogsPaginated = async (
	pageSize: number = 10,
	lastVisibleDoc: any = null
) => {
	try {
		const logsCollectionRef = collection(db, "habitsLogs");

		let logsQuery = query(
			logsCollectionRef,
			orderBy("mostRecentLog", "desc"),

			limit(pageSize)
		);

		if (lastVisibleDoc) {
			logsQuery = query(logsQuery, startAfter(lastVisibleDoc));
		}

		const querySnapshot = await getDocs(logsQuery);

		if (querySnapshot.empty) {
			return { logs: [], lastVisible: null, hasMore: false };
		}

		const logs = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const logData = doc.data();
				const memberInfo = await getMemberProfileByUid(logData.uid);
				const habitInfo = await getHabitById(logData.habitId);

				if (memberInfo?.activityConfidentiality !== "public") {
					return null;
				}

				return {
					id: doc.id,
					...logData,
					member: memberInfo || null,
					habit: habitInfo || null,
				};
			})
		);

		const filteredLogs = logs.filter((log) => log !== null);

		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			logs: filteredLogs,
			lastVisible,
			hasMore: filteredLogs.length === pageSize,
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des logs :", error);
		throw error;
	}
};