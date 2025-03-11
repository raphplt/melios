import React, { useRef } from "react";
import { View, Alert, Pressable, Text } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import MonthlyRecap from "./MonthlyRecap";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import ZoomableView from "@components/Shared/ZoomableView";

const ShareMonthlyRecap = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const LAST_DAYS_TO_SHOW = 2;

	const today = new Date();
	const currentMonthLastDay = new Date(
		today.getFullYear(),
		today.getMonth() + 1,
		0
	).getDate();
	const isInLastDays =
		today.getDate() >= currentMonthLastDay - LAST_DAYS_TO_SHOW + 1;

	if (!isInLastDays) {
		return null;
	}

	const recapRef: any = useRef();

	const generateAndShareImage = async () => {
		try {
			const uri = await captureRef(recapRef, {
				format: "png",
				quality: 1,
			});

			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
				return;
			}

			await Sharing.shareAsync(uri);
		} catch (error) {
			if (error instanceof Error)
				Alert.alert("Erreur lors du partage", error.message);
		}
	};

	return (
		<View className="flex-1 p-3 w-full items-center justify-center">
			<View
				ref={recapRef}
				collapsable={false}
				className="w-full py-3 flex items-center justify-center"
			>
				<MonthlyRecap />
			</View>

			<ZoomableView className="w-full items-center justify-center">
				<Pressable
					onPress={generateAndShareImage}
					style={{
						backgroundColor: theme.colors.primary,
					}}
					className="mt-4 w-[95%] p-4 rounded-2xl flex flex-row items-center justify-center space-x-2"
				>
					<Text
						style={{
							color: theme.colors.textSecondary,
						}}
						className="text-center font-semibold px-2"
					>
						{t("share_monthly_recap")}
					</Text>
					<Iconify
						icon="material-symbols:share"
						size={20}
						color={theme.colors.textSecondary}
					/>
				</Pressable>
			</ZoomableView>
		</View>
	);
};



export default ShareMonthlyRecap;
