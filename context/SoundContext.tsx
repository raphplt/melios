import { createContext, useContext, useEffect, useState } from "react";

export type Sound = {
	file: string;
	displayName: string;
};

export type SoundContextProps = {
	sounds: Sound[];
	soundMap: { [key: string]: any };
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
	const [soundMap, setSoundMap] = useState<{ [key: string]: any }>({});
	const [loadingSounds, setLoadingSounds] = useState<boolean>(true);
	const [currentSound, setCurrentSound] = useState<string>("");

	useEffect(() => {
		const loadSounds = async () => {
			try {
				const soundFiles: Sound[] = [
					{ file: "birds.mp3", displayName: "🐦 Oiseaux" },
					{ file: "rain.mp3", displayName: "🌧️ Pluie" },
					{ file: "waves.mp3", displayName: "🌊 Vagues" },
					{ file: "fireplace.mp3", displayName: "🔥 Cheminée" },
					{ file: "white-noise.mp3", displayName: "📢 Bruit blanc" },
					{ file: "wind.mp3", displayName: "💨 Vent" },
					{ file: "night.mp3", displayName: "🌙 Nuit" },
				];
				const soundMap = {
					"birds.mp3": require("@assets/sounds/birds.mp3"),
					"rain.mp3": require("@assets/sounds/rain.mp3"),
					"waves.mp3": require("@assets/sounds/waves.mp3"),
					"fireplace.mp3": require("@assets/sounds/fireplace.mp3"),
					"white-noise.mp3": require("@assets/sounds/white-noise.mp3"),
					"wind.mp3": require("@assets/sounds/wind.mp3"),
					"night.mp3": require("@assets/sounds/night.mp3"),
				};
				setSounds(soundFiles);
				setSoundMap(soundMap);
			} catch (error) {
				console.error("Error loading sounds", error);
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
