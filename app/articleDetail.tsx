import React, { useState, useRef } from "react";
import {
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import { Post } from "@type/post";
import { Iconify } from "react-native-iconify";

const ArticleDetail = () => {
	const route = useRoute();
	const { article } = route.params as { article: Post };
	const scrollViewRef = useRef<ScrollView>(null);
	const [showScrollTop, setShowScrollTop] = useState(false);

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		setShowScrollTop(offsetY > 300);
	};

	const scrollToTop = () => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: true });
	};

	return (
		<SafeAreaView style={styles.safeContainer}>
			<ScrollView
				ref={scrollViewRef}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{article.coverImage && (
					<Image source={{ uri: article.coverImage }} style={styles.coverImage} />
				)}
				<View style={styles.header}>
					<Text style={styles.title}>{article.title}</Text>
					<Text style={styles.date}>
						{new Date(article.date).toLocaleDateString()}
					</Text>
				</View>
				<Markdown style={markdownStyles}>{article.content}</Markdown>
			</ScrollView>
			{showScrollTop && (
				<TouchableOpacity onPress={scrollToTop} style={styles.scrollTopButton}>
					<Iconify icon="fluent:arrow-up-24-regular" color="#fff" size={25} />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeContainer: {
		flex: 1,
		backgroundColor: "#f9f9f9",
	},
	container: {
		flex: 1,
		padding: 16,
	},
	contentContainer: {
		paddingBottom: 24,
	},
	coverImage: {
		width: "100%",
		height: 220,
		borderRadius: 10,
		marginBottom: 16,
	},
	header: {
		marginBottom: 12,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 4,
	},
	date: {
		fontSize: 14,
		color: "#888",
	},
	scrollTopButton: {
		position: "absolute",
		right: 20,
		bottom: 30,
		backgroundColor: "rgb(8, 32, 159)",
		padding: 10,
		borderRadius: 25,
		elevation: 5,
	},
});

const markdownStyles: StyleSheet.NamedStyles<any> = {
	heading1: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#222",
	},
	heading2: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 8,
		color: "#222",
	},
	text: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 10,
		color: "#444",
	},
	paragraph: {
		marginBottom: 12,
	},
	list_item: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 6,
	},
	hr: {
		height: 0,
		marginVertical: 0,
		borderWidth: 0,
	},
};

export default ArticleDetail;
