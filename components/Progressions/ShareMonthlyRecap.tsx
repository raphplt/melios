import React, { useRef, useState, useEffect } from "react";
import { View, Alert, Pressable, Text, ActivityIndicator } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MonthlyRecap from "./MonthlyRecap";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import ZoomableView from "@components/Shared/ZoomableView";

const ShareMonthlyRecap = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const [isSharing, setIsSharing] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Suppression de la limitation arbitraire des 2 derniers jours
	// Le composant est maintenant toujours disponible

	const recapRef = useRef<View>(null);

	// Génère une clé unique pour le mois actuel
	const getCurrentMonthKey = () => {
		const now = new Date();
		return `monthly_recap_hidden_${now.getFullYear()}_${now.getMonth()}`;
	};

	// Vérifie si le composant est masqué pour ce mois
	const checkHiddenStatus = async () => {
		try {
			const monthKey = getCurrentMonthKey();
			const hiddenStatus = await AsyncStorage.getItem(monthKey);
			setIsHidden(hiddenStatus === "true");
		} catch (error) {
			console.log("Erreur lors de la vérification du statut:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Masque le composant pour le mois actuel
	const hideRecap = async () => {
		try {
			const monthKey = getCurrentMonthKey();
			await AsyncStorage.setItem(monthKey, "true");
			setIsHidden(true);
		} catch (error) {
			console.log("Erreur lors du masquage:", error);
		}
	};

	// Vérifie le statut au chargement du composant
	useEffect(() => {
		checkHiddenStatus();
	}, []);

	const generateAndShareImage = async () => {
		try {
			setIsSharing(true);
			const uri = await captureRef(recapRef, {
				format: "png",
				quality: 1,
				result: "tmpfile",
			});

			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert(
					t("error") || "Erreur",
					t("sharing_not_available") ||
						"Le partage n'est pas disponible sur cet appareil",
					[{ text: t("ok") || "OK", style: "default" }]
				);
				return;
			}

			await Sharing.shareAsync(uri, {
				mimeType: "image/png",
				dialogTitle:
					t("share_monthly_recap") || "Partager le récapitulatif mensuel",
			});
		} catch (error) {
			Alert.alert(
				t("sharing_error") || "Erreur lors du partage",
				error instanceof Error
					? error.message
					: t("unknown_error") || "Erreur inconnue",
				[{ text: t("ok") || "OK", style: "default" }]
			);
		} finally {
			setIsSharing(false);
		}
	};

	// Affichage du loading pendant la vérification
	if (isLoading) {
		return (
			<View
				className="flex-1 w-full items-center justify-center"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	// Ne rien afficher si le composant est masqué
	if (isHidden) {
		return null;
	}

	return (
		<View
			className="flex-1 w-full items-center justify-center"
			style={{ backgroundColor: theme.colors.background }}
		>
			{/* Bouton de fermeture */}
			<View className="w-full flex-row justify-end px-4 pt-2">
				<Pressable
					onPress={hideRecap}
					style={({ pressed }) => ({
						backgroundColor: pressed
							? theme.colors.backgroundSecondary
							: theme.colors.cardBackground,
						opacity: pressed ? 0.7 : 1,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 4,
						elevation: 3,
						borderColor: theme.colors.border,
						borderWidth: 1,
					})}
					className="w-10 h-10 rounded-full items-center justify-center"
					accessible
					accessibilityRole="button"
					accessibilityLabel={t("close") || "Fermer"}
					accessibilityHint={
						t("hide_monthly_recap_hint") ||
						"Masquer le récapitulatif jusqu'au prochain mois"
					}
				>
					<Iconify icon="mdi:close" size={20} color={theme.colors.textTertiary} />
				</Pressable>
			</View>

			{/* Container pour la capture d'écran */}
			<View
				ref={recapRef}
				collapsable={false}
				className="w-full py-6 flex items-center justify-center"
				style={{ backgroundColor: theme.colors.background }}
			>
				<MonthlyRecap />
			</View>

			{/* Bouton de partage amélioré */}
			<View className="w-full items-center px-4 pb-6">
				<Pressable
					onPress={generateAndShareImage}
					disabled={isSharing}
					style={({ pressed }) => ({
						backgroundColor: pressed
							? theme.colors.primaryLight || theme.colors.primary
							: theme.colors.primary,
						opacity: isSharing ? 0.7 : 1,
						shadowColor: theme.colors.primary,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 8,
						elevation: 8,
					})}
					className="w-full max-w-sm p-4 rounded-2xl flex-row items-center justify-center space-x-3"
					accessible
					accessibilityRole="button"
					accessibilityLabel={t("share_monthly_recap")}
					accessibilityHint={
						t("share_monthly_recap_hint") ||
						"Partage une image de votre récapitulatif mensuel"
					}
				>
					{isSharing ? (
						<>
							<ActivityIndicator color={theme.colors.text} size="small" />
							<Text
								style={{ color: theme.colors.text }}
								className="text-base font-semibold ml-2"
							>
								{t("sharing") || "Partage en cours..."}
							</Text>
						</>
					) : (
						<View className="flex-row items-center space-x-2 gap-2">
							<Iconify icon="mdi:share-variant" size={24} color={theme.colors.text} />
							<Text
								style={{ color: theme.colors.text }}
								className="text-base font-bold"
							>
								{t("share_monthly_recap")}
							</Text>
							<Iconify icon="mdi:arrow-right" size={20} color={theme.colors.text} />
						</View>
					)}
				</Pressable>

				{/* Sous-titre inspirant */}
				<Text
					style={{ color: theme.colors.text }}
					className="text-sm text-center mt-4 px-4 font-medium"
				>
					{t("share_progress_motivation") ||
						"Partagez vos progrès et inspirez votre communauté !"}
				</Text>
			</View>
		</View>
	);
};

export default ShareMonthlyRecap;
