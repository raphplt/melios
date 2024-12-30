import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	View,
	Pressable,
	Text,
	ScrollView,
	Platform,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { BlurView } from "expo-blur";

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
	const { t } = useTranslation();

	const [isTutorialVisible, setTutorialVisible] = useState(true);

	useEffect(() => {
		const fetchLocalNew = async () => {
			const alreadyView = await AsyncStorage.getItem(slug);
			if (alreadyView) {
				setTutorialVisible(false);
			}
		};
		fetchLocalNew();
	}, []);

	const handleClose = async () => {
		await AsyncStorage.setItem(slug, "true");
		setTutorialVisible(false);
	};

	return (
		<Modal
			visible={isTutorialVisible}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setTutorialVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{/* Flou d’arrière-plan (iOS) ou fallback (Android) */}
				{Platform.OS === "ios" ? (
					<BlurView
						intensity={50}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
						tint="dark"
					/>
				) : (
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.4)",
						}}
					/>
				)}

				{/* Illustration */}
				<CachedImage imagePath={imagePath} style={{ width: 150, height: 250 }} />

				{/* Background click to close */}
				<Pressable
					onPress={() => setTutorialVisible(false)}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
					}}
				/>

				{/* Dialog content */}
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						padding: 20,
						borderRadius: 10,
						width: "85%",
						maxHeight: "70%",
					}}
				>
					{/* Title */}
					<Text
						style={{
							color: theme.colors.text,
							fontSize: 18,
							fontWeight: "bold",
							marginBottom: 10,
						}}
					>
						{title}
					</Text>

					{/* Paragraphs */}
					<ScrollView>
						{paragraphs.map((paragraph, index) => (
							<View
								key={index}
								style={{
									marginBottom: 10,
									backgroundColor: theme.colors.background,
									padding: 10,
									borderRadius: 8,
								}}
							>
								<Text
									style={{
										color: theme.colors.text,
										fontSize: 14,
										lineHeight: 20,
									}}
								>
									{paragraph}
								</Text>
							</View>
						))}
					</ScrollView>

					{/* Button to close */}
					<Pressable
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 8,
							marginTop: 10,
							paddingVertical: 10,
						}}
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
				</View>
			</View>
		</Modal>
	);
}
