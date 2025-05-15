import { LeagueRoom } from "@type/leagueRoom";
import { db } from ".";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	setDoc,
	deleteDoc,
} from "firebase/firestore";

const LEAGUE_ROOM_COLLECTION = "leagueRooms";

export const getAllLeagueRooms = async (): Promise<LeagueRoom[]> => {
	const snapshot = await getDocs(collection(db, LEAGUE_ROOM_COLLECTION));
	return snapshot.docs.map(
		(doc) => ({ id: doc.id, ...doc.data() } as LeagueRoom)
	);
};

export const getLeagueRoomById = async (
	id: string
): Promise<LeagueRoom | null> => {
	const docRef = doc(db, LEAGUE_ROOM_COLLECTION, id);
	const snapshot = await getDoc(docRef);
	return snapshot.exists()
		? ({ id: snapshot.id, ...snapshot.data() } as LeagueRoom)
		: null;
};

export const createOrUpdateLeagueRoom = async (
	room: LeagueRoom
): Promise<void> => {
	const docRef = doc(db, LEAGUE_ROOM_COLLECTION, room.id);
	await setDoc(docRef, room);
};

export const deleteLeagueRoom = async (id: string): Promise<void> => {
	const docRef = doc(db, LEAGUE_ROOM_COLLECTION, id);
	await deleteDoc(docRef);
};
