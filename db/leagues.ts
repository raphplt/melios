import { League } from "@type/league";
import { db } from ".";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	setDoc,
	deleteDoc,
} from "firebase/firestore";

const LEAGUE_COLLECTION = "leagues";

export const getAllLeagues = async (): Promise<League[]> => {
	const snapshot = await getDocs(collection(db, LEAGUE_COLLECTION));
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as League));
};

export const getLeagueById = async (id: string): Promise<League | null> => {
	const docRef = doc(db, LEAGUE_COLLECTION, id);
	const snapshot = await getDoc(docRef);
	return snapshot.exists()
		? ({ id: snapshot.id, ...snapshot.data() } as League)
		: null;
};

export const createOrUpdateLeague = async (league: League): Promise<void> => {
	const docRef = doc(db, LEAGUE_COLLECTION, league.id);
	await setDoc(docRef, league);
};

export const deleteLeague = async (id: string): Promise<void> => {
	const docRef = doc(db, LEAGUE_COLLECTION, id);
	await deleteDoc(docRef);
};
