import { useState, useEffect } from "react";
import { useTheme } from "@context/ThemeContext";
import { useSound, Sound } from "@context/SoundContext";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function SoundsModal({
	visible,
	setVisible,
	onChange,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onChange: (sound: string) => void;
}) {
	const { theme } = useTheme();
	const { sounds, soundMap, loadingSounds, currentSound, setCurrentSound } =
		useSound();
	const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);

	// Nettoie les ressources du son chargé lors du démontage
	useEffect(() => {
		return () => {
			if (soundObject) {
				soundObject.unloadAsync();
			}
		};
	}, [soundObject]);
	// Gérer la sélection et la lecture d'un son
	const handleSoundPress = async (sound: Sound) => {
		try {
			// Arrêter et décharger le son précédent
			if (soundObject) {
				await soundObject.stopAsync();
				await soundObject.unloadAsync();
				setSoundObject(null);
			}

			// Si "Aucun son" est sélectionné, ne pas charger de nouveau son
			if (sound.file) {
				const soundUri = soundMap[sound.file];
				const { sound: newSound, status } = await Audio.Sound.createAsync(
					{ uri: soundUri } // Utilise un objet avec `uri`
				);
				setSoundObject(newSound);

				// Configurer le son pour qu'il se répète indéfiniment
				await newSound.setIsLoopingAsync(true);

				// Vérifier que le son est bien chargé avant de le jouer
				if (status.isLoaded) {
					await newSound.playAsync();
				} else {
					console.error("Sound is not loaded");
				}
			}

			// Mettre à jour l'état
			onChange(sound.file);
			setCurrentSound(sound.file);
		} catch (error) {
			console.error("Error playing sound", error);
		}
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "rgba(0,0,0,0.4)",
				}}
			>
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.border,
						borderWidth: 1,
						padding: 20,
						borderRadius: 10,
					}}
					className="w-11/12"
				>
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-xl leading-6 mb-3 font-semibold"
					>
						Choisissez un son
					</Text>
					{loadingSounds ? (
						<Text>Chargement des sons...</Text>
					) : (
						<>
							<Pressable
								onPress={() =>
									handleSoundPress({ file: "", displayName: "🔇 Aucun son" })
								}
								className="flex flex-row items-center py-2 rounded-xl px-2 my-1"
							>
								<Ionicons
									name={currentSound === "" ? "radio-button-on" : "radio-button-off"}
									size={24}
									color={theme.colors.primary}
								/>
								<Text
									style={{
										color: theme.colors.textTertiary,
									}}
									className="text-[18px] ml-2"
								>
									🔇 Aucun son
								</Text>
							</Pressable>
							{sounds.map((sound, index) => (
								<Pressable
									key={index}
									onPress={() => handleSoundPress(sound)}
									className="flex flex-row items-center py-2 rounded-xl px-2 my-1"
									style={{
										backgroundColor:
											currentSound === sound.file
												? theme.colors.backgroundTertiary
												: theme.colors.cardBackground,
									}}
								>
									<Ionicons
										name={
											sound.file === currentSound ? "radio-button-on" : "radio-button-off"
										}
										size={24}
										color={theme.colors.primary}
									/>
									<Text
										style={{
											color: theme.colors.textTertiary,
										}}
										className="text-[18px] ml-2"
									>
										{sound.displayName}
									</Text>
								</Pressable>
							))}
						</>
					)}
					<Pressable
						onPress={() => setVisible(false)}
						style={{
							backgroundColor: theme.colors.primary,
						}}
						className="rounded-2xl mt-3 py-3 "
					>
						<Text
							style={{
								color: theme.colors.background,
								fontFamily: "BaskervilleBold",
							}}
							className="text-lg text-center"
						>
							Valider
						</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
