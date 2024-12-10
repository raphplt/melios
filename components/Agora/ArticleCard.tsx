import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";

interface ArticleProps {
	title: string;
	description: string;
	link: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ title, description, link }) => {
	return (
		<TouchableOpacity onPress={() => Linking.openURL(link)}>
			<View style={styles.card}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description} numberOfLines={3}>
					{description}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		marginVertical: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	description: {
		fontSize: 14,
		color: "#555",
	},
});

export default ArticleCard;
