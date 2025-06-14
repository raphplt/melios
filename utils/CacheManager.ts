import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_MEMBER_INFO_KEY } from "../db/member";

/**
 * Utilitaires pour gérer le cache des données utilisateur
 */
export class CacheManager {
	/**
	 * Force le rechargement des données depuis Firebase en supprimant le cache local
	 */
	static async clearMemberCache(): Promise<void> {
		try {
			await AsyncStorage.removeItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			console.log("Member cache cleared successfully");
		} catch (error) {
			console.error("Error clearing member cache:", error);
		}
	}

	/**
	 * Met à jour partiellement le cache local
	 */
	static async updateMemberCache(updates: Partial<any>): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const parsedData = JSON.parse(cachedData);
				const updatedData = { ...parsedData, ...updates };
				await AsyncStorage.setItem(
					LOCAL_STORAGE_MEMBER_INFO_KEY,
					JSON.stringify(updatedData)
				);
				console.log("Member cache updated successfully");
			}
		} catch (error) {
			console.error("Error updating member cache:", error);
		}
	}

	/**
	 * Vérifie si le cache est valide (pas trop ancien)
	 */
	static async isCacheValid(maxAgeMinutes: number = 30): Promise<boolean> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (!cachedData) return false;

			const data = JSON.parse(cachedData);
			if (!data.cacheTimestamp) return false;

			const cacheAge = Date.now() - data.cacheTimestamp;
			const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

			return cacheAge < maxAge;
		} catch (error) {
			console.error("Error checking cache validity:", error);
			return false;
		}
	}

	/**
	 * Ajoute un timestamp au cache pour la validation
	 */
	static async stampCache(): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);
				data.cacheTimestamp = Date.now();
				await AsyncStorage.setItem(
					LOCAL_STORAGE_MEMBER_INFO_KEY,
					JSON.stringify(data)
				);
			}
		} catch (error) {
			console.error("Error stamping cache:", error);
		}
	}
}
