import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { app } from "./index";

const storage = getStorage(app);
const memoryCache: Record<string, string> = {};

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

		console.log("Downloading image from Firebase:", fileUrl);
		await FileSystem.downloadAsync(fileUrl, localUri);

		// Mettez à jour le cache
		memoryCache[imagePath] = localUri;
		return localUri;
	} catch (error) {
		console.error("Error fetching or caching image:", error);
		throw error;
	}
};
