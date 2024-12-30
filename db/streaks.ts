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
		// Récupération de l'utilisateur actuel
		const user = auth.currentUser;
		if (!user || !user.uid) throw new Error("Utilisateur non authentifié");

		const uid = user.uid;
		const streakDocRef = doc(db, "usersStreaks", uid);

		// Vérifie si le document existe
		const streakDocSnapshot = await getDoc(streakDocRef);
		if (!streakDocSnapshot.exists()) {
			throw new Error(
				"Aucun streak trouvé pour cet utilisateur. Veuillez initialiser le streak d'abord."
			);
		}

		// Récupère les données actuelles du streak
		const currentStreak: Streak = streakDocSnapshot.data() as Streak;

		// Vérifie si la dernière mise à jour a été faite
		const lastUpdated = new Date(currentStreak.updatedAt);
		const now = new Date();
		const timeDifference = now.getTime() - lastUpdated.getTime();
		const hoursSinceLastUpdate = timeDifference / (1000 * 60 * 60); // Convertit en heures

		// Réinitialise la streak si elle n'a pas été mise à jour depuis plus de 48 heures
		if (hoursSinceLastUpdate >= 48) {
			const resetStreak: Streak = {
				...currentStreak,
				value: 0,
				updatedAt: now.toISOString(),
			};
			await updateDoc(streakDocRef, {
				value: resetStreak.value,
				updatedAt: resetStreak.updatedAt,
			});
			console.log(
				"La streak a été réinitialisée car plus de 48 heures se sont écoulées."
			);
			return resetStreak;
		}

		// Ne pas incrémenter si la streak a déjà été mise à jour dans les 24 dernières heures
		if (hoursSinceLastUpdate < 24) {
			console.log(
				"La streak a déjà été incrémentée dans les dernières 24 heures."
			);
			return currentStreak;
		}

		// Incrémente la streak et met à jour le maxValue si nécessaire
		const updatedValue = currentStreak.value + 1;
		const updatedMaxValue = Math.max(currentStreak.maxValue, updatedValue);

		// Mise à jour des données dans Firestore
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

		console.log("La streak a été incrémentée avec succès.");
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
