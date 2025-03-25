import PackPreview from "@components/Recompenses/PackPreview";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { Audio } from "expo-av";

const Pack = () => {
	const { selectedPack } = useData();
	const { theme } = useTheme();
	const [unlocked, setUnlocked] = useState(false);
	const [currentChapter, setCurrentChapter] = useState(0);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);

	// Simulate audio URLs for each chapter
	const getAudioUrl = (index: number) => {
		// This would be replaced with actual URLs from your backend
		return `https://example.com/audio/pack-${selectedPack?.id}-chapter-${index}.mp3`;
	};

	useEffect(() => {
		return () => {
			if (sound) {
				sound.unloadAsync();
			}
		};
	}, []);

	const loadAudio = async (chapterIndex: number) => {
		// Unload previous audio if exists
		if (sound) {
			await sound.unloadAsync();
		}

		try {
			const audioUrl = getAudioUrl(chapterIndex);
			const { sound: newSound } = await Audio.Sound.createAsync(
				{ uri: audioUrl },
				{ shouldPlay: false },
				onPlaybackStatusUpdate
			);

			setSound(newSound);
			setIsPlaying(false);
			setPosition(0);

			// Get duration
			const status = await newSound.getStatusAsync();
			if (status.isLoaded) {
				setDuration(status.durationMillis || 0);
			}
		} catch (error) {
			console.error("Error loading audio:", error);
		}
	};

	const onPlaybackStatusUpdate = (status: any) => {
		if (status.isLoaded) {
			setPosition(status.positionMillis);
			setIsPlaying(status.isPlaying);

			// Auto advance to next chapter when current one finishes
			if (status.didJustFinish) {
				handleNextChapter();
			}
		}
	};

	const togglePlayPause = async () => {
		if (!sound) return;

		if (isPlaying) {
			await sound.pauseAsync();
		} else {
			await sound.playAsync();
		}
	};

	const handlePreviousChapter = () => {
		if (currentChapter > 0) {
			const newChapterIndex = currentChapter - 1;
			setCurrentChapter(newChapterIndex);
			loadAudio(newChapterIndex);
		}
	};

	const handleNextChapter = () => {
		if (
			selectedPack &&
			currentChapter < selectedPack.content.sections.length - 1
		) {
			const newChapterIndex = currentChapter + 1;
			setCurrentChapter(newChapterIndex);
			loadAudio(newChapterIndex);
		}
	};

	const selectChapter = (index: number) => {
		setCurrentChapter(index);
		loadAudio(index);
	};

	const formatTime = (milliseconds: number) => {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

	useEffect(() => {
		if (selectedPack && selectedPack.content.sections.length > 0) {
			loadAudio(currentChapter);
		}
	}, [selectedPack]);

	if (!selectedPack) return null;

	// if (!unlocked)
	// 	return <PackPreview />;

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<ButtonClose />

				<View
					className="flex-row items-center p-2 justify-center w-11/12 mx-auto rounded-xl"
					style={{
						borderColor: selectedPack.color ?? theme.colors.backgroundSecondary,
						borderWidth: 2,
						backgroundColor: theme.colors.background,
					}}
				>
					<Text
						className="text-xl font-bold"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{selectedPack.name}
					</Text>
				</View>

				<View className="mb-24 mt-4">
					{selectedPack.content.sections.length > 0 && (
						<View
							className="w-11/12 mx-auto mb-6 p-4 rounded-xl"
							style={{
								backgroundColor: theme.colors.backgroundSecondary,
							}}
						>
							<Text
								className="text-xl font-bold mb-2"
								style={{
									color: theme.colors.text,
									fontFamily: "BaskervilleBold",
								}}
							>
								{selectedPack.content.sections[currentChapter].title}
							</Text>

							<View className="p-2 bg-opacity-10">
								{selectedPack.content.sections[currentChapter].details.map(
									(detail, index) => (
										<Text
											key={index}
											className="text-base pb-2"
											style={{ color: theme.colors.text }}
										>
											{detail}
										</Text>
									)
								)}
							</View>
						</View>
					)}

					<View className="w-11/12 mx-auto">
						<Text
							className="text-lg font-bold mb-2"
							style={{ color: theme.colors.text }}
						>
							Tous les chapitres
						</Text>

						{selectedPack.content.sections.map((section, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => selectChapter(index)}
								className={`p-3 mb-2 flex-row justify-between items-center rounded-lg ${
									currentChapter === index ? "border-2" : ""
								}`}
								style={{
									backgroundColor: theme.colors.backgroundSecondary,
									borderColor:
										currentChapter === index ? selectedPack.color : "transparent",
								}}
							>
								<View className="flex-row items-center">
									<View
										className="w-8 h-8 rounded-full justify-center items-center mr-3"
										style={{ backgroundColor: selectedPack.color }}
									>
										<Text style={{ color: "#fff", fontWeight: "bold" }}>{index + 1}</Text>
									</View>
									<Text className="font-medium" style={{ color: theme.colors.text }}>
										{section.title}
									</Text>
								</View>

								{currentChapter === index && isPlaying && (
									<Iconify icon="mdi:volume-high" size={20} color={theme.colors.text} />
								)}
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>

			{/* Player Controls - Fixed at bottom */}
			<View
				className="absolute bottom-0 left-0 right-0 p-4 rounded-t-xl"
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
					borderTopWidth: 1,
					borderTopColor: selectedPack.color,
				}}
			>
				{/* Progress bar */}
				<View className="h-1 w-full bg-gray-300 rounded-full mb-3">
					<View
						className="h-full rounded-full"
						style={{
							width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
							backgroundColor: selectedPack.color,
						}}
					/>
				</View>

				{/* Time indicators */}
				<View className="flex-row justify-between mb-2">
					<Text style={{ color: theme.colors.text }}>{formatTime(position)}</Text>
					<Text style={{ color: theme.colors.text }}>{formatTime(duration)}</Text>
				</View>

				{/* Control buttons */}
				<View className="flex-row justify-between items-center">
					<TouchableOpacity
						onPress={handlePreviousChapter}
						disabled={currentChapter === 0}
					>
						<Iconify
							icon="mdi:skip-previous"
							size={28}
							color={
								currentChapter === 0 ? theme.colors.textSecondary : theme.colors.text
							}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						className="w-14 h-14 rounded-full justify-center items-center"
						style={{ backgroundColor: selectedPack.color }}
						onPress={togglePlayPause}
					>
						{isPlaying ? (
							<Iconify icon="mdi:pause" size={32} color="#FFFFFF" />
						) : (
							<Iconify icon="mdi:play" size={32} color="#FFFFFF" />
						)}
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleNextChapter}
						disabled={currentChapter >= selectedPack.content.sections.length - 1}
					>
						<Iconify
							icon="mdi:skip-next"
							size={28}
							color={
								currentChapter >= selectedPack.content.sections.length - 1
									? theme.colors.textSecondary
									: theme.colors.text
							}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default Pack;