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
import { DEFAULT_LEAGUES } from "../constants/defaultLeagues";

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

// Initialiser les ligues par défaut si elles n'existent pas
export const initializeDefaultLeagues = async (
	force: boolean = false
): Promise<void> => {
	const existingLeagues = await getAllLeagues();

	if (existingLeagues.length === 0 || force) {
		console.log("Initializing default leagues...");

		// Si force = true, supprimer les ligues existantes d'abord
		if (force && existingLeagues.length > 0) {
			console.log("Forcing reset: deleting existing leagues...");
			for (const league of existingLeagues) {
				await deleteLeague(league.id);
			}
		}

		for (const leagueData of DEFAULT_LEAGUES) {
			const leagueId = `league_${leagueData.rank}`;
			const league: League = {
				...leagueData,
				id: leagueId,
			};
			await createOrUpdateLeague(league);
			console.log(
				`Created league: ${league.name} (${league.id}) - Points required: ${league.pointsRequired}`
			);
		}
		console.log("Default leagues initialized successfully!");
	} else {
		console.log(
			`${existingLeagues.length} leagues already exist, skipping initialization`
		);
	}
};
