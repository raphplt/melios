import React from "react";
import { Share, TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

const ShareApp = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const inviteFriends = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins-moi sur cette super application ! Télécharge-la ici : https://example.com/download",
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					console.log("Partagé via une activité spécifique");
				} else {
					console.log("Partage réussi");
				}
			} else if (result.action === Share.dismissedAction) {
				console.log("Partage annulé");
			}
		} catch (error) {
			console.error("Erreur lors du partage :", error);
		}
	};

	return (
		<TouchableOpacity
			className="flex flex-row items-center mt-5 px-4 py-2 rounded-lg"
			style={{
				backgroundColor: theme.colors.primary,
			}}
			onPress={inviteFriends}
		>
			<Iconify icon="mdi:share-variant" size={20} color="#fff" />
			<Text
				className="ml-3 text-lg font-semibold text-white"
				style={{
					color: "#fff",
				}}
			>
				{t("invite_friends")}
			</Text>
		</TouchableOpacity>
	);
};

export default ShareApp;
