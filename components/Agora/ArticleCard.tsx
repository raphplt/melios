import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import { useTheme } from "@context/ThemeContext";
import { BlurView } from "expo-blur";

interface ArticleProps {
	title: string;
	description: string;
	link: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ title, description, link }) => {
	const { theme } = useTheme();
	return (
		<TouchableOpacity
			onPress={() => Linking.openURL(link)}
			className="w-[95%] mx-auto"
		>
			<View
				style={{
					backgroundColor: theme.colors.card,
				}}
				className="p-4 rounded-lg shadow-sm my-1"
			>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-xl font-bold"
				>
					{title}
				</Text>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-sm"
					numberOfLines={3}
				>
					{description}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});


export default ArticleCard;
