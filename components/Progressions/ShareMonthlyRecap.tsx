import React, { useRef } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import MonthlyRecap from "./MonthlyRecap";

const ShareMonthlyRecap = () => {
	const LAST_DAYS_TO_SHOW = 2;
	const FIRST_DAYS_TO_SHOW = 2;

	const today = new Date();
	const currentMonthLastDay = new Date(
		today.getFullYear(),
		today.getMonth() + 1,
		0
	).getDate();
	const isInLastDays =
		today.getDate() >= currentMonthLastDay - LAST_DAYS_TO_SHOW + 1;
	const isInFirstDays = today.getDate() <= FIRST_DAYS_TO_SHOW;

	if (!(isInLastDays || isInFirstDays)) {
		return null;
	}

	const recapRef = useRef();

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
		<View style={styles.container}>
			<View ref={recapRef} collapsable={false} style={styles.recapContainer}>
				<MonthlyRecap />
			</View>
			<Button title="Partager le récap du mois" onPress={generateAndShareImage} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f2f2f2",
	},
	recapContainer: {
		marginBottom: 20,
		backgroundColor: "#ffffff",
		padding: 10,
		borderRadius: 10,
	},
});

export default ShareMonthlyRecap;
