import ArticleCard from "@components/Agora/ArticleCard";
import { useRssFeed } from "@hooks/useRssFeed";
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";

const themes: Record<string, string> = {
	Sport: "https://www.espn.com/espn/rss/news",
	BienEtre: "https://www.wellandgood.com/feed/",
	ConditionPhysique: "https://breakingmuscle.com/feed/",
	SanteMentale: "https://www.mentalhealth.org.uk/rss/news",
	Alimentation: "https://rss.nytimes.com/services/xml/rss/nyt/Food.xml",
	TachesMenageres: "https://feeds.feedburner.com/TheSpruceCleaning",
	VieSociale: "https://www.psychologytoday.com/intl/social-life.rss",
	Budget: "https://www.thebalance.com/personal-finance-4074014.rss",
	Culture: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
	Creativite: "https://99u.adobe.com/feed",
	Travail: "https://www.fastcompany.com/rss",
	Competences: "https://www.skillshare.com/blog/feed/",
	Ecologie: "https://www.nationalgeographic.com/environment/feed/",
	Spiritualite: "https://spiritualityhealth.com/rss",
	Productivite: "https://zenhabits.net/feed/",
};

const HomeFeed = () => {
	const [selectedTheme, setSelectedTheme] = useState<string>("Sport");
	const { items, loading } = useRssFeed(themes[selectedTheme]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Actualités</Text>
			<View style={styles.filters}>
				{Object.keys(themes).map((theme) => (
					<TouchableOpacity
						key={theme}
						style={[
							styles.filterButton,
							theme === selectedTheme && styles.filterButtonActive,
						]}
						onPress={() => setSelectedTheme(theme)}
					>
						<Text style={styles.filterText}>{theme}</Text>
					</TouchableOpacity>
				))}
			</View>
			{loading ? (
				<Text>Chargement des articles...</Text>
			) : (
				<FlatList
					data={items}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<ArticleCard
							title={item.title}
							description={item.description}
							link={item.link}
						/>
					)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f8f9fa",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	filters: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 15,
	},
	filterButton: {
		padding: 10,
		backgroundColor: "#e9ecef",
		margin: 5,
		borderRadius: 5,
	},
	filterButtonActive: {
		backgroundColor: "#007bff",
	},
	filterText: {
		color: "#000",
		fontSize: 14,
	},
});

export default HomeFeed;
