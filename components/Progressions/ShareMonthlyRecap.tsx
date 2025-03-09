// ShareMonthlyRecap.js
import React, { useRef } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import MonthlyRecap from "./MonthlyRecap";

const ShareMonthlyRecap = () => {
	const recapRef = useRef();

	const generateAndShareImage = async () => {
		try {
			// Génération de l'image depuis le composant
			const uri = await captureRef(recapRef, {
				format: "png",
				quality: 1,
			});

			// Vérification si le partage est disponible
			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
				return;
			}

			// Partage de l'image générée
			await Sharing.shareAsync(uri);
		} catch (error) {
			if (error instanceof Error)
				Alert.alert("Erreur lors du partage", error.message);
		}
	};

	return (
		<View style={styles.container}>
			<View ref={recapRef} style={styles.recapContainer}>
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
	},
});

export default ShareMonthlyRecap;
