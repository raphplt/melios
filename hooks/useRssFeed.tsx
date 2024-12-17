import { useState, useEffect } from "react";
import { parseString } from "react-native-xml2js";

interface RssItem {
	title: string;
	link: string;
	description: string;
	pubDate: string;
}

const parseRSS = (rssText: string): Promise<RssItem[]> => {
	return new Promise((resolve, reject) => {
		parseString(rssText, (err, result) => {
			if (err) {
				reject(err);
			} else {
				const items = result.rss.channel[0].item.map((item: any) => ({
					title: item.title[0] || "Sans titre",
					link: item.link[0] || "#",
					description: item.description[0] || "",
					pubDate: item.pubDate[0] || "",
				}));
				resolve(items);
			}
		});
	});
};

export const useRssFeed = (url: string) => {
	const [items, setItems] = useState<RssItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchRSS = async () => {
			try {
				const response = await fetch(url);
				const text = await response.text();

				// Ajout d'une étape de débogage pour vérifier le contenu récupéré
				// console.log("Contenu récupéré :", text);

				const parsedItems = await parseRSS(text);
				setItems(parsedItems);
			} catch (error) {
				console.error("Erreur lors de la récupération du flux RSS :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRSS();
	}, [url]);

	return { items, loading };
};
