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
	getDoc,
	Timestamp,
	addDoc,
	deleteDoc,
	collectionGroup,
	DocumentData,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, auth } from ".";
import { getMemberProfileByUid } from "./member";
import { getHabitById } from "./userHabit";
import { CategoryTypeSelect } from "@utils/category.type";
import { DailyLog, Log } from "@type/log";

export const REACTION_TYPES = ["flame", "heart", "like"];

export function ensureDate(d: any): Date {
	if (!d) return new Date();
	if (d instanceof Date) return d;
	if (d.toDate && typeof d.toDate === "function") {
		return d.toDate();
	}
	return new Date(d);
}

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

			const newLog: Log = {
				id: newLogDocRef.id,
				uid: uid,
				habitId: habitId,
				createdAt: new Date(),
			};

			await setDoc(newLogDocRef, newLog);

			const dailyLogsCollectionRef = collection(newLogDocRef, "dailyLogs");
			const newDailyLog: DailyLog = {
				id: doc(dailyLogsCollectionRef).id,
				logDocId: newLogDocRef.id,
				date: logDateObj,
			};

			await addDoc(dailyLogsCollectionRef, newDailyLog);
		} else {
			const logDoc = querySnapshot.docs[0];
			const logDocRef = doc(db, "habitsLogs", logDoc.id);

			const dailyLogsCollectionRef = collection(logDocRef, "dailyLogs");
			const newDailyLog: DailyLog = {
				id: doc(dailyLogsCollectionRef).id,
				logDocId: logDoc.id,
				date: logDateObj,
			};

			await addDoc(dailyLogsCollectionRef, newDailyLog);

			await updateDoc(logDocRef, {
				updatedAt: serverTimestamp(),
			});
		}
	} catch (error) {
		console.error("Erreur lors de l'ajout ou de la mise à jour du log :", error);
		throw error;
	}
};

/**
 * Récupère les logs de l'utilisateur connecté sur les 7 derniers jours
 * @param options Options de récupération
 * @returns Logs filtrés des 7 derniers jours
 */
export const getRecentHabitLogs = async ({ 
  signal, 
  forceRefresh 
}: GetAllHabitLogsParams = {}): Promise<Log[]> => {
  try {
    // Récupérer tous les logs de l'utilisateur
    const allLogs = await getAllHabitLogs({ signal, forceRefresh });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
	  return allLogs.map(log => {
	if (!log.logs) return null;
      // Filtrer les dailyLogs de chaque log
      const recentDailyLogs = log.logs.filter(dailyLog => {
        const logDate = ensureDate(dailyLog.date);
        return logDate >= sevenDaysAgo;
      });
      
      if (recentDailyLogs.length > 0) {
        return {
          ...log,
          logs: recentDailyLogs
        };
      }
      
      return null;
    }).filter(log => log !== null) as Log[];
  } catch (error) {
    console.error("Erreur lors de la récupération des logs récents :", error);
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
		const dailyLogsCollectionRef = collection(logDoc.ref, "dailyLogs");

		const dailyLogsSnapshot = await getDocs(dailyLogsCollectionRef);

		const habitLogs = dailyLogsSnapshot.docs.map((doc) => doc.data());

		return habitLogs;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des logs in getHabitsLogs :",
			error
		);
		throw error;
	}
};

interface GetAllHabitLogsParams {
	signal?: AbortSignal;
	forceRefresh?: boolean;
}

/**
 *  Fonction pour récupérer l'ensemble des logs de l'utilisateur
 */
export const getAllHabitLogs = async ({
	signal,
	forceRefresh,
}: GetAllHabitLogsParams): Promise<Log[]> => {
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
			return [];
		}

		const allLogs = await Promise.all(
			querySnapshot.docs.map(async (habitDoc) => {
				const habitData = habitDoc.data();

				const dailyLogsCollectionRef = collection(habitDoc.ref, "dailyLogs");
				const dailyLogsSnapshot = await getDocs(dailyLogsCollectionRef);

				const dailyLogs: DailyLog[] = dailyLogsSnapshot.docs.map((dailyDoc) => {
					const dData = dailyDoc.data();

					return {
						id: dailyDoc.id,
						logDocId: habitDoc.id,
						date: dData.date?.toDate ? dData.date.toDate() : dData.date,
						reactions: dData.reactions || [],
					};
				});

				return {
					id: habitDoc.id,
					habitId: habitData.habitId,
					uid: habitData.uid,
					createdAt: habitData.createdAt?.toDate
						? habitData.createdAt.toDate()
						: null,
					updatedAt: habitData.updatedAt?.toDate
						? habitData.updatedAt.toDate()
						: null,
					logs: dailyLogs,
				} as Log;
			})
		);

		return allLogs;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des logs in getAllHabitLogs :",
			error
		);
		throw error;
	}
};

export async function addReactionToLog(
	habitLogId: string,
	dailyLogId: string,
	uid: string,
	type: string,
	logDateISO: string
) {
	const logRef = doc(db, "habitsLogs", habitLogId, "dailyLogs", dailyLogId);
	const logDoc = await getDoc(logRef);

	if (!logDoc.exists()) {
		console.error("Log not found");
		throw new Error("Log not found");
	}

	const logData = logDoc.data() as DailyLog;

	const targetDate = new Date(logDateISO);
	if (isNaN(targetDate.getTime())) {
		throw new Error("Invalid date provided");
	}

	const updatedReactions = [...(logData.reactions || []), { uid, type }];
	await updateDoc(logRef, { reactions: updatedReactions });
}

export async function removeReactionFromLog(
	habitLogId: string,
	dailyLogId: string,
	uid: string,
	type: string,
	logDateISO: string
) {
	const logRef = doc(db, "habitsLogs", habitLogId, "dailyLogs", dailyLogId);
	const logDoc = await getDoc(logRef);

	if (!logDoc.exists()) {
		console.error("Log not found");
		throw new Error("Log not found");
	}

	const logData = logDoc.data() as DailyLog;

	const updatedReactions = (logData.reactions || []).filter(
		(reaction) => !(reaction.uid === uid && reaction.type === type)
	);

	await updateDoc(logRef, { reactions: updatedReactions });
}

export type DailyLogExtended = {
	id: string;
	logDocId: string;
	habitId: string;
	habit: any;
	user: any;
	uid: string;
	date: Date;
	reactions: { uid: string; type: string }[];
};

/**
 * Récupère les dailyLogs directement via une collectionGroup query,
 * en se basant sur le champ "date" (desc), et applique ensuite en local
 * les règles de confidentialité.
 *
 * @param pageSize        Nombre de logs à récupérer par page
 * @param lastVisibleDoc  Dernier document de la page précédente (pour startAfter)
 * @param confidentiality Filtrage global ("public" ou "friends")
 * @param friends         Tableau d'UID des amis de l'utilisateur courant
 */
export const getAllDailyLogsPaginated = async (
	pageSize = 10,
	lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null,
	confidentiality: string = "public",
	friends: string[] = []
): Promise<{
	dailyLogs: DailyLogExtended[];
	lastVisible: QueryDocumentSnapshot<DocumentData> | null;
	hasMore: boolean;
}> => {
	try {
		let baseQuery = query(
			collectionGroup(db, "dailyLogs"),
			orderBy("date", "desc"),
			limit(pageSize)
		);

		if (lastVisibleDoc) {
			baseQuery = query(baseQuery, startAfter(lastVisibleDoc));
		}

		const snapshot = await getDocs(baseQuery);

		if (snapshot.empty) {
			return {
				dailyLogs: [],
				lastVisible: null,
				hasMore: false,
			};
		}

		const dailyLogs: DailyLogExtended[] = [];

		for (const docSnap of snapshot.docs) {
			const dailyLogData = docSnap.data();
			const parentLogDocRef = docSnap.ref.parent.parent;
			if (!parentLogDocRef) continue; // cas improbable

			const parentLogSnap = await getDoc(parentLogDocRef);
			if (!parentLogSnap.exists()) continue;

			const logData = parentLogSnap.data();
			if (!logData) continue;

			// -- Récupération du profil user
			const memberInfo = await getMemberProfileByUid(logData.uid).catch((err) => {
				console.error("Erreur getMemberProfileByUid:", err);
				return null;
			});

			// -- Récupération de l'info habit
			const habitInfo: any = await getHabitById(logData.habitId).catch((err) => {
				console.error("Erreur getHabitById:", err);
				return null;
			});

			// -- Filtrage de base (exclure négatif, privé, etc.)
			if (!habitInfo || habitInfo.type === CategoryTypeSelect.negative) continue;
			if (!memberInfo || memberInfo.activityConfidentiality === "private")
				continue;

			// Filtre si la confidentialité de l'user est "friends" mais qu'on n'est pas dans sa liste
			if (
				memberInfo.activityConfidentiality === "friends" &&
				!friends.includes(memberInfo.uid)
			) {
				continue;
			}

			// Filtre global si on est en mode "friends" côté UI
			if (confidentiality === "friends" && !friends.includes(memberInfo.uid)) {
				continue;
			}

			// Gestion du champ date (Timestamp -> Date)
			let date: Date;
			const rawDate = dailyLogData.date;
			if (rawDate instanceof Timestamp) {
				date = rawDate.toDate();
			} else if (rawDate instanceof Date) {
				date = rawDate;
			} else if (typeof rawDate === "string") {
				date = new Date(rawDate);
			} else {
				console.warn("Date inconnue ou invalide :", rawDate);
				date = new Date(NaN);
			}

			dailyLogs.push({
				id: docSnap.id,
				logDocId: parentLogSnap.id,
				habitId: logData.habitId,
				habit: habitInfo,
				user: memberInfo,
				uid: logData.uid,
				date,
				reactions: dailyLogData.reactions || [],
			});
		}

		const hasMore = snapshot.size === pageSize;

		const newLastVisible =
			snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

		return {
			dailyLogs,
			lastVisible: hasMore ? newLastVisible : null,
			hasMore,
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des logs paginés :", error);
		throw error;
	}
};

export const deleteLogsByHabitId = async (habitId: string) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");
		if (!habitId) throw new Error("Identifiant de l'habitude manquant");

		const habit = await getHabitById(habitId).catch(() => null);
		if (habit) {
			console.log(`L'habitude ${habitId} existe, aucun log ne sera supprimé.`);
			return;
		}

		const logsCollectionRef = collection(db, "habitsLogs");
		const q = query(
			logsCollectionRef,
			where("uid", "==", uid),
			where("habitId", "==", habitId)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			console.warn(`Aucun log trouvé pour l'habitude ${habitId}`);
			return;
		}

		const logDoc = querySnapshot.docs[0];
		const dailyLogsCollectionRef = collection(logDoc.ref, "dailyLogs");
		const dailyLogsSnapshot = await getDocs(dailyLogsCollectionRef);

		await Promise.all(
			dailyLogsSnapshot.docs.map(async (docSnap) => {
				await deleteDoc(docSnap.ref);
			})
		);

		await deleteDoc(logDoc.ref);

		console.log(`Tous les logs pour l'habitude ${habitId} ont été supprimés.`);
	} catch (error) {
		console.error("Erreur lors de la suppression des logs :", error);
		throw error;
	}
};
