import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from ".";
import { Streak } from "@type/streak";

/**
 * Initialize the streaks collection for the user, if it doesn't already exist.
 */
export const initializeStreak = async () => {
	try {
		const user = auth.currentUser;
		if (!user || !user.uid) throw new Error("Utilisateur non authentifié");

		const uid = user.uid;
		const streakDocRef = doc(collection(db, "usersStreaks"), uid);

		const streakDocSnapshot = await getDoc(streakDocRef);
		if (streakDocSnapshot.exists()) {
			console.log("Le document streak existe déjà pour cet utilisateur.");
			return;
		}

		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const streak: Streak = {
			uid: uid,
			value: 0,
			updatedAt: yesterday.toISOString(),
			maxValue: 0,
			userUid: uid,
		};

		await setDoc(streakDocRef, streak);
		console.log("Le document streak a été initialisé avec succès.");

		return streak;
	} catch (error) {
		console.error("Erreur lors de l'initialisation du streak:", error);
	}
};

/**
 * Increment the streak value for the current user, if it hasn't been updated in the last 24 hours.
 * Reset the streak if it hasn't been updated in the last 48 hours.
 * @returns {Promise<Streak | null>} The updated streak document or null if an error occurs.
 */
export const incrementStreak = async (): Promise<Streak | null> => {
	try {
		const user = auth.currentUser;
		if (!user || !user.uid) throw new Error("Utilisateur non authentifié");

		const uid = user.uid;
		const streakDocRef = doc(db, "usersStreaks", uid);

		const streakDocSnapshot = await getDoc(streakDocRef);
		if (!streakDocSnapshot.exists()) {
			throw new Error(
				"Aucun streak trouvé pour cet utilisateur. Veuillez initialiser le streak d'abord."
			);
		}

		const currentStreak: Streak = streakDocSnapshot.data() as Streak;

		const lastUpdated = new Date(currentStreak.updatedAt);
		const now = new Date();
		const timeDifference = now.getTime() - lastUpdated.getTime();
		const hoursSinceLastUpdate = timeDifference / (1000 * 60 * 60);

		if (currentStreak.value === 0 || hoursSinceLastUpdate >= 48) {
			const updatedStreak: Streak = {
				...currentStreak,
				value: 1, // Commencer un nouveau streak
				updatedAt: now.toISOString(),
				maxValue: Math.max(currentStreak.maxValue, 1),
			};

			await updateDoc(streakDocRef, {
				value: updatedStreak.value,
				updatedAt: updatedStreak.updatedAt,
				maxValue: updatedStreak.maxValue,
			});

			return updatedStreak;
		}

		if (hoursSinceLastUpdate < 24) {
			return currentStreak;
		}

		const updatedValue = currentStreak.value + 1;
		const updatedMaxValue = Math.max(currentStreak.maxValue, updatedValue);

		const updatedStreak: Streak = {
			...currentStreak,
			value: updatedValue,
			updatedAt: now.toISOString(),
			maxValue: updatedMaxValue,
		};

		await updateDoc(streakDocRef, {
			value: updatedStreak.value,
			updatedAt: updatedStreak.updatedAt,
			maxValue: updatedStreak.maxValue,
		});

		return updatedStreak;
	} catch (error) {
		console.error(
			"Erreur lors de l'incrémentation ou de la réinitialisation de la streak:",
			error
		);
		return null;
	}
};

/**
 * Retrieve the current streak for the user.
 */
export const getUserStreak = async (): Promise<Streak | null> => {
	try {
		// Récupération de l'utilisateur actuel
		const user = auth.currentUser;
		if (!user || !user.uid) throw new Error("Utilisateur non authentifié");

		const uid = user.uid;
		const streakDocRef = doc(db, "usersStreaks", uid);

		const streakDocSnapshot = await getDoc(streakDocRef);
		if (!streakDocSnapshot.exists()) {
			console.log("Aucun streak trouvé pour cet utilisateur.");
			return null;
		}

		const currentStreak: Streak = streakDocSnapshot.data() as Streak;
		return currentStreak;
	} catch (error) {
		console.error("Erreur lors de la récupération de la streak:", error);
		return null;
	}
};
