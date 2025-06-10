import { useState, useEffect } from "react";
import { useTheme } from "@context/ThemeContext";
import { useSound, Sound } from "@context/SoundContext";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import React from "react";
import BottomSlideModal from "./ModalBottom";
import { AudioPlayer } from "expo-audio";

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
	const { t } = useTranslation();
	const { sounds, soundMap, loadingSounds, currentSound, setCurrentSound } =
		useSound();
	const [soundObject, setSoundObject] = useState<AudioPlayer | null>(null);

	useEffect(() => {
		return () => {
			if (soundObject) {
				soundObject.remove();
			}
		};
	}, [soundObject]);

	const handleSoundPress = async (sound: Sound) => {
		try {
			if (soundObject) {
				soundObject.remove();
				setSoundObject(null);
			}

			if (sound.file) {
				const soundUri = soundMap[sound.file];
				const newSound = new AudioPlayer(soundUri, 100);
				setSoundObject(newSound);

				newSound.loop = true;
				await newSound.play();
			}

			// Mettre à jour l'état
			onChange(sound.file);
			setCurrentSound(sound.file);
		} catch (error) {
			console.error("Error playing sound", error);
		}
	};

	return (
		<BottomSlideModal visible={visible} setVisible={setVisible}>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-xl leading-6 mb-4 font-semibold"
			>
				{t("select_sound")}
			</Text>
			{loadingSounds ? (
				<Text>{t("loading")}</Text>
			) : (
				<>
					<Pressable
						onPress={() =>
							handleSoundPress({ file: "", displayName: "🔇 Aucun son" })
						}
						style={{
							borderColor: theme.colors.border,
							borderWidth: 1,
							backgroundColor:
								currentSound === ""
									? theme.colors.backgroundTertiary
									: theme.colors.cardBackground,
						}}
						className="flex flex-row items-center py-2 rounded-xl px-2 my-1"
					>
						<Ionicons
							name={currentSound === "" ? "radio-button-on" : "radio-button-off"}
							size={24}
							color={theme.colors.primary}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-lg font-semibold ml-2"
						>
							🔇 {t("no_sound")}
						</Text>
					</Pressable>
					{sounds.map((sound, index) => (
						<Pressable
							key={index}
							onPress={() => handleSoundPress(sound)}
							className="flex flex-row items-center py-2 rounded-xl px-2 my-1"
							style={{
								borderColor: theme.colors.border,
								borderWidth: 1,
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
									color: theme.colors.text,
								}}
								className="text-lg font-semibold ml-2"
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
				className="rounded-2xl my-3 py-3"
			>
				<Text
					style={{
						color: theme.colors.background,
						fontFamily: "BaskervilleBold",
					}}
					className="text-lg text-center"
				>
					{t("validate")}
				</Text>
			</Pressable>
		</BottomSlideModal>
	);
}