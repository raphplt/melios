import { createContext, useContext, useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { app } from "@db/index";

export type Sound = {
	file: string;
	displayName: string;
};

export type SoundContextProps = {
	sounds: Sound[];
	soundMap: { [key: string]: string }; // Map des sons avec les chemins locaux
	setSounds: (sounds: Sound[]) => void;
	loadingSounds: boolean;
	setLoadingSounds: (loading: boolean) => void;
	currentSound: string;
	setCurrentSound: (sound: string) => void;
};

export const SoundContext = createContext<SoundContextProps>({
	sounds: [],
	soundMap: {},
	setSounds: () => {},
	loadingSounds: true,
	setLoadingSounds: () => {},
	currentSound: "",
	setCurrentSound: () => {},
});

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
	const [sounds, setSounds] = useState<Sound[]>([]);
	const [soundMap, setSoundMap] = useState<{ [key: string]: string }>({});
	const [loadingSounds, setLoadingSounds] = useState<boolean>(true);
	const [currentSound, setCurrentSound] = useState<string>("");

	const cacheDirectory = FileSystem.cacheDirectory;
	const storage = getStorage(app);

	/**
	 * Télécharge et met en cache un son depuis Firebase Storage
	 * @param soundPath Chemin du son dans Firebase Storage
	 * @returns {Promise<string>} Chemin local du son
	 */
	const getCachedSound = async (soundPath: string): Promise<string> => {
		try {
			const localUri = `${cacheDirectory}${soundPath.replace(/\//g, "_")}`;
			const fileInfo = await FileSystem.getInfoAsync(localUri);

			if (fileInfo.exists) {
				return localUri; // Retourne le chemin local si le fichier existe déjà
			}

			// Téléchargez le fichier depuis Firebase Storage
			const storageRef = ref(storage, soundPath);
			const fileUrl = await getDownloadURL(storageRef);

			await FileSystem.downloadAsync(fileUrl, localUri);
			return localUri;
		} catch (error) {
			console.error(`Error caching sound: ${soundPath}`, error);
			throw error;
		}
	};

	useEffect(() => {
		const loadSounds = async () => {
			try {
				// Définir la liste des sons
				const soundFiles: Sound[] = [
					{ file: "/sounds/birds.mp3", displayName: "🐦 Oiseaux" },
					{ file: "/sounds/rain.mp3", displayName: "🌧️ Pluie" },
					{ file: "/sounds/waves.mp3", displayName: "🌊 Vagues" },
					{ file: "/sounds/fireplace.mp3", displayName: "🔥 Cheminée" },
					{ file: "/sounds/white-noise.mp3", displayName: "📢 Bruit blanc" },
					{ file: "/sounds/wind.mp3", displayName: "💨 Vent" },
					{ file: "/sounds/night.mp3", displayName: "🌙 Nuit" },
				];

				// Téléchargez et mettez en cache chaque son
				const soundMap: { [key: string]: string } = {};
				for (const sound of soundFiles) {
					const localUri = await getCachedSound(sound.file);
					soundMap[sound.file] = localUri;
				}

				setSounds(soundFiles);
				setSoundMap(soundMap);
			} catch (error) {
				console.error("Error loading sounds:", error);
			} finally {
				setLoadingSounds(false);
			}
		};

		loadSounds();
	}, []);

	return (
		<SoundContext.Provider
			value={{
				sounds,
				soundMap,
				setSounds,
				loadingSounds,
				setLoadingSounds,
				currentSound,
				setCurrentSound,
			}}
		>
			{children}
		</SoundContext.Provider>
	);
};

export const useSound = () => {
	const context = useContext(SoundContext);
	if (!context) {
		throw new Error("useSound must be used within a SoundProvider");
	}
	return context;
};
