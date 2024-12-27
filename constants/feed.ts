export const themes: Record<string, { name: string; urls: string[] }> = {
	sport: { name: "Sport", urls: ["https://www.espn.com/espn/rss/news"] },
	bienEtre: { name: "Bien Être", urls: ["https://www.wellandgood.com/feed/"] },
	conditionPhysique: {
		name: "Condition Physique",
		urls: ["https://breakingmuscle.com/feed/"],
	},
	santeMentale: {
		name: "Santé Mentale",
		urls: [
			"https://www.santepubliquefrance.fr/rss/themes/sante-mentale.xml?1735307399",
			"https://www.santementale.fr/feed/",
			"https://www.mentalhealth.org.uk/rss/news",
		],
	},
	alimentation: {
		name: "Alimentation",
		urls: ["https://rss.nytimes.com/services/xml/rss/nyt/Food.xml"],
	},
	tachesMenageres: {
		name: "Tâches Ménagères",
		urls: ["https://feeds.feedburner.com/TheSpruceCleaning"],
	},
	vieSociale: {
		name: "Vie Sociale",
		urls: ["https://www.psychologytoday.com/intl/social-life.rss"],
	},
	budget: {
		name: "Budget",
		urls: ["https://www.thebalance.com/personal-finance-4074014.rss"],
	},
	culture: {
		name: "Culture",
		urls: ["http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
	},
	creativite: { name: "Créativité", urls: ["https://99u.adobe.com/feed"] },
	travail: { name: "Travail", urls: ["https://www.fastcompany.com/rss"] },
	competences: {
		name: "Compétences",
		urls: ["https://www.skillshare.com/blog/feed/"],
	},
	ecologie: {
		name: "Écologie",
		urls: ["https://www.nationalgeographic.com/environment/feed/"],
	},
	spiritualite: {
		name: "Spiritualité",
		urls: ["https://spiritualityhealth.com/rss"],
	},
	productivite: { name: "Productivité", urls: ["https://zenhabits.net/feed/"] },
};
