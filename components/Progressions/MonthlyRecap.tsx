// MonthlyRecap.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MonthlyRecap = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Récapitulatif du Mois</Text>
			<Text style={styles.data}>📅 Mois : Mars 2025</Text>
			<Text style={styles.data}>✅ Habitudes complétées : 26 / 31</Text>
			<Text style={styles.data}>🏅 Niveau atteint : Spartiate (niveau 5)</Text>
			<Text style={styles.data}>🔥 Série maximale : 14 jours</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		borderRadius: 15,
		backgroundColor: "#fff",
		alignItems: "center",
		elevation: 4,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 15,
	},
	data: {
		fontSize: 16,
		marginVertical: 4,
	},
});

export default MonthlyRecap;
