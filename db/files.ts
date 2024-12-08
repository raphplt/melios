import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { app } from "./index";

const storage = getStorage(app);
const memoryCache: Record<string, string> = {};
const soundCache: Record<string, string> = {};

/**
 * Télécharge et stocke localement une image depuis Firebase Storage.
 * Si elle est déjà en cache mémoire ou local, retourne son chemin.
 * @param imagePath Chemin de l'image dans Firebase Storage
 * @returns {Promise<string>} Chemin local de l'image
 */
export const getCachedImage = async (imagePath: string): Promise<string> => {
	try {
		if (memoryCache[imagePath]) {
			return memoryCache[imagePath];
		}

		const localUri = `${FileSystem.cacheDirectory}${imagePath.replace(
			/\//g,
			"_"
		)}`;

		const fileInfo = await FileSystem.getInfoAsync(localUri);
		if (fileInfo.exists) {
			memoryCache[imagePath] = localUri;
			return localUri;
		}

		// Téléchargez depuis Firebase Storage
		const storageRef = ref(storage, imagePath);
		const fileUrl = await getDownloadURL(storageRef);

		await FileSystem.downloadAsync(fileUrl, localUri);

		// Mettez à jour le cache
		memoryCache[imagePath] = localUri;
		return localUri;
	} catch (error) {
		console.error("Error fetching or caching image:", error);
		throw error;
	}
};

/**
 * Télécharge et stocke localement un son depuis Firebase Storage.
 * Si le fichier est déjà en cache mémoire ou local, retourne son chemin local.
 * @param soundPath Chemin du son dans Firebase Storage
 * @returns {Promise<string>} Chemin local du son
 */
export const getCachedSound = async (soundPath: string): Promise<string> => {
	try {
		if (soundCache[soundPath]) {
			return soundCache[soundPath];
		}

		const localUri = `${FileSystem.cacheDirectory}${soundPath.replace(
			/\//g,
			"_"
		)}`;

		const fileInfo = await FileSystem.getInfoAsync(localUri);
		if (fileInfo.exists) {
			soundCache[soundPath] = localUri;
			return localUri;
		}

		// Téléchargez depuis Firebase Storage
		const storageRef = ref(storage, soundPath);
		const fileUrl = await getDownloadURL(storageRef);

		await FileSystem.downloadAsync(fileUrl, localUri);

		// Mettez à jour le cache
		soundCache[soundPath] = localUri;
		return localUri;
	} catch (error) {
		console.error("Error fetching or caching sound:", error);
		throw error;
	}
};

/**
 * Joue un son en utilisant Expo Audio API.
 * @param soundPath Chemin local du son
 */
export const playSound = async (soundPath: string) => {
	try {
		const { sound } = await Audio.Sound.createAsync({ uri: soundPath });
		await sound.playAsync();
	} catch (error) {
		console.error("Error playing sound:", error);
	}
};
