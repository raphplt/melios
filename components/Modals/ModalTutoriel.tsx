import { useTheme } from "@context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable, Text, ScrollView } from "react-native";
import ZoomableView from "@components/Shared/ZoomableView";
import { useData } from "@context/DataContext";
import BottomSlideModal from "./ModalBottom";

export default function ModalTutorial({
	title = "Tutoriel",
	paragraphs = [],
	imagePath,
	slug,
}: {
	title?: string;
	paragraphs?: string[];
	imagePath: string;
	slug: string;
}) {
	const { theme } = useTheme();
	const { member } = useData();
	const { t } = useTranslation();

	const [isTutorialVisible, setTutorialVisible] = useState(false);
	const hasCheckedStorage = useRef(false);

	const fetchLocalNew = useCallback(async () => {
		if (!hasCheckedStorage.current) {
			const alreadyView = await AsyncStorage.getItem(slug);
			if (!alreadyView) {
				setTutorialVisible(true);
			}
			hasCheckedStorage.current = true;
		}
	}, [slug]);

	useEffect(() => {
		fetchLocalNew();
	}, [fetchLocalNew]);

	const handleClose = async () => {
		await AsyncStorage.setItem(slug, "true");
		setTutorialVisible(false);
	};

	if (!member) return null;

	return (
		<BottomSlideModal
			visible={isTutorialVisible}
			setVisible={setTutorialVisible}
			title={title}
		>
			<View
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				className="w-full py-3"
			>
				{/* Paragraphs */}
				<ScrollView className="w-full mt-4">
					{paragraphs.map((paragraph, index) => (
						<View
							key={index}
							style={{
								backgroundColor: theme.colors.background,
							}}
							className="mb-3 p-3 rounded-lg"
						>
							<Text
								style={{
									color: theme.colors.textTertiary,
								}}
								className="leading-5"
							>
								{paragraph}
							</Text>
						</View>
					))}
				</ScrollView>

				{/* Button to close */}
				<ZoomableView>
					<Pressable
						style={{
							backgroundColor: theme.colors.primary,
						}}
						className="flex items-center justify-center py-3 px-5 rounded-xl mt-3"
						onPress={() => handleClose()}
					>
						<Text
							style={{
								color: theme.colors.textSecondary,
								textAlign: "center",
								fontSize: 16,
								fontWeight: "bold",
							}}
						>
							{t("understood")}
						</Text>
					</Pressable>
				</ZoomableView>
			</View>
		</BottomSlideModal>
	);
}
