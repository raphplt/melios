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
	writeBatch,
} from "firebase/firestore";
import { db, auth } from ".";
import { getMemberProfileByUid } from "./member";
import { getHabitById } from "./userHabit";
import { CategoryTypeSelect } from "@utils/category.type";
import { DailyLog, Log } from "@type/log";
import dayjs from "dayjs";

export const REACTION_TYPES = ["flame", "heart", "like"];

export function ensureDate(d: any): Date {
	if (!d) return new Date(); // fallback
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
		if (!habitId) throw new Error("[SET] - Identifiant de l'hab itude manquant");

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

/**
 *  Fonction pour récupérer l'ensemble des logs de l'utilisateur
 * @param param0
 * @returns
 */
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
			return [];
		}

		const allLogs = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const dailyLogsCollectionRef = collection(doc.ref, "dailyLogs");
				const dailyLogsSnapshot = await getDocs(dailyLogsCollectionRef);

				const dailyLogs = dailyLogsSnapshot.docs.map((doc) => doc.data());

				return {
					habitId: doc.data().habitId,
					logs: dailyLogs,
					id: doc.id,
					uid: doc.data().uid,
					createdAt: doc.data().createdAt,
					updatedAt: doc.data().updatedAt,
				};
			})
		);

		return allLogs;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des logs in getAllHabitsLogs :",
			error
		);
		throw error;
	}
};

/**
 * Récupère, par pagination, la liste des logs (habitsLogs),
 * classés par mostRecentLog desc, et filtre (ou convertit) les dailyLogs
 * pour ne garder que ceux au **nouveau** format { date, reactions }.
 */
export const getAllUsersLogsPaginated = async (
	pageSize: number = 10,
	lastVisibleDoc: any = null,
	confidentiality: string = "public",
	friends: string[] = []
) => {
	try {
		const dailyLogsCollectionRef = collection(db, "dailyLogs");

		let logsQuery = query(
			dailyLogsCollectionRef,
			orderBy("date", "desc"),
			limit(pageSize)
		);

		if (lastVisibleDoc) {
			logsQuery = query(logsQuery, startAfter(lastVisibleDoc));
		}

		const querySnapshot = await getDocs(logsQuery);

		if (querySnapshot.empty) {
			return { logs: [], lastVisible: null, hasMore: false };
		}

		const rawLogs = await Promise.all(
			querySnapshot.docs.map(async (docSnap) => {
				const logData = docSnap.data();
				if (!logData) return null;

				const memberInfo = await getMemberProfileByUid(logData.uid);
				const habitInfo: any = await getHabitById(logData.habitId);

				if (!habitInfo || habitInfo.type === CategoryTypeSelect.negative) {
					return null;
				}

				if (!memberInfo || memberInfo.activityConfidentiality === "private") {
					return null;
				}
				if (
					memberInfo.activityConfidentiality === "friends" &&
					!friends.includes(memberInfo.uid)
				) {
					return null;
				}

				if (confidentiality === "friends" && !friends.includes(memberInfo.uid)) {
					return null;
				}

				return {
					id: docSnap.id,
					uid: logData.uid,
					habitId: logData.habitId,
					date: logData.date,
					reactions: logData.reactions || [],
					member: memberInfo || null,
					habit: habitInfo || null,
				};
			})
		);

		const filteredLogs = rawLogs.filter((log) => log !== null);
		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			logs: filteredLogs,
			lastVisible,
			hasMore: querySnapshot.size === pageSize,
		};
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des logs in getAllUsersLogsPaginated :",
			error
		);
		throw error;
	}
};

export async function addReactionToLog(
	logId: string,
	uid: string,
	type: string,
	logDateISO: string
) {
	const logRef = doc(db, "dailyLogs", logId);
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
	logId: string,
	uid: string,
	type: string,
	logDateISO: string
) {
	const logRef = doc(db, "dailyLogs", logId);
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
	logDocId: string;
	habitId: string;
	habit: any;
	user: any;
	uid: string;
	date: Date;
	reactions: { uid: string; type: string }[];
};

/**
 * Récupère les docs "habitsLogs" par ordre de mostRecentLog (desc),
 * puis aplatit tous les dailyLogs dans un grand tableau trié par date.
 */

export const getAllDailyLogsPaginated = async (
	pageSize = 10,
	lastVisible: any = null,
	confidentiality: string = "public",
	friends: string[] = []
) => {
	try {
		const logsCollectionRef = collection(db, "habitsLogs");

		let logsQuery = query(
			logsCollectionRef,
			orderBy("mostRecentLog", "desc"),
			limit(pageSize)
		);

		if (lastVisible) {
			logsQuery = query(logsQuery, startAfter(lastVisible));
		}

		const habitsLogsSnapshot = await getDocs(logsQuery);
		if (habitsLogsSnapshot.empty) {
			return { dailyLogs: [], lastVisible: null, hasMore: false };
		}

		let allDailyLogs: DailyLogExtended[] = [];
		let newLastVisible = null;

		// Parcourir chaque habitsLog
		for (const logDocSnap of habitsLogsSnapshot.docs) {
			const logData = logDocSnap.data();
			if (!logData) continue;

			// Filtrer par confidentialité et amis
			const memberInfo = await getMemberProfileByUid(logData.uid);
			const habitInfo: any = await getHabitById(logData.habitId);

			if (!habitInfo || habitInfo.type === CategoryTypeSelect.negative) continue;
			if (!memberInfo || memberInfo.activityConfidentiality === "private") continue;
			if (
				memberInfo.activityConfidentiality === "friends" &&
				!friends.includes(memberInfo.uid)
			) {
				continue;
			}
			if (confidentiality === "friends" && !friends.includes(memberInfo.uid)) {
				continue;
			}

			// Récupérer les dailyLogs paginés
			const dailyLogsCollectionRef = collection(logDocSnap.ref, "dailyLogs");
			let dailyLogsQuery = query(
				dailyLogsCollectionRef,
				orderBy("date", "desc"),
				limit(pageSize)
			);

			if (lastVisible) {
				dailyLogsQuery = query(dailyLogsQuery, startAfter(lastVisible));
			}

			const dailyLogsSnapshot = await getDocs(dailyLogsQuery);
			newLastVisible = dailyLogsSnapshot.docs[dailyLogsSnapshot.docs.length - 1];

			const dailyLogs = dailyLogsSnapshot.docs.map((docSnap) => {
				const dailyLogData = docSnap.data();
				let date: Date;
				if (dailyLogData.date instanceof Timestamp) {
					date = dailyLogData.date.toDate();
				} else if (dailyLogData.date instanceof Date) {
					date = dailyLogData.date;
				} else if (typeof dailyLogData.date === "string") {
					date = new Date(dailyLogData.date);
				} else {
					date = new Date(NaN);
				}

				return {
					logDocId: logDocSnap.id,
					habitId: logData.habitId,
					habit: habitInfo,
					user: memberInfo,
					uid: logData.uid,
					date,
					reactions: dailyLogData.reactions || [],
				};
			});

			allDailyLogs = allDailyLogs.concat(dailyLogs);
		}

		// Trier tous les logs globalement par date
		allDailyLogs.sort((a, b) => b.date.getTime() - a.date.getTime());

		return {
			dailyLogs: allDailyLogs.slice(0, pageSize),
			lastVisible: newLastVisible,
			hasMore: allDailyLogs.length >= pageSize,
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des logs paginés :", error);
		throw error;
	}
};