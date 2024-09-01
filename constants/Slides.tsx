export interface Answer {
	answer: string;
	value: number;
	icon?: string;
}

export interface Question {
	question: string;
	slug: string;
	answers: Answer[];
	questionType: string;
	tips: string;
}

export const Questions: Question[] = [
	{
		question: "Bienvenue sur Melios ! Êtes-vous prêt à commencer votre aventure?",
		slug: "welcome",
		answers: [
			{ answer: "Oui, je suis prêt !", value: 1 },
			{ answer: "Non, pas encore.", value: 2 },
		],
		questionType: "SingleChoice",
		tips: "Vous pouvez changer d'avis à tout moment",
	},
	{
		question: "Quels sont vos objectifs ?",
		slug: "objectifs",
		answers: [
			{ answer: "Développer de bonnes habitudes", value: 1 },
			{ answer: "Arrêter des mauvaises habitudes", value: 2 },
			{ answer: "Mieux gérer mon temps", value: 2 },
		],
		questionType: "MultipleChoice",
		tips: "Vous pouvez sélectionner plusieurs réponses",
	},
	{
		question: "Quels aspects de votre vie voulez-vous améliorer ?",
		slug: "aspects",
		answers: [
			{ answer: "Santé", value: 1 },
			{ answer: "Travail", value: 2 },
			{ answer: "Sport", value: 3 },
			{ answer: "Loisirs", value: 4 },
			{ answer: "Autre", value: 5 },
		],
		questionType: "MultipleChoice",
		tips: "Vous pouvez sélectionner plusieurs réponses",
	},
	{
		question: "Quel est votre niveau de motivation ?",
		slug: "motivation",
		answers: [
			{ answer: "Je suis très motivé", value: 1 },
			{ answer: "Je veux m'améliorer", value: 2 },
			{ answer: "Je veux prendre mon temps", value: 3 },
		],
		questionType: "SingleChoice",
		tips: "Vous pourrez changer votre niveau de motivation plus tard",
	},
	{
		question:
			"Combien de temps voulez-vous consacrer à vos habitudes chaque jour ?",
		slug: "temps",
		answers: [
			{ answer: "Moins de 10 minutes", value: 1 },
			{ answer: "Entre 10 et 30 minutes", value: 2 },
			{ answer: "Plus de 30 minutes", value: 3 },
		],
		questionType: "SingleChoice",
		tips: "Vous pourrez changer votre temps accordé aux habitudes plus tard",
	},
	{
		question: "Quel est votre nom ?",
		slug: "nom",
		answers: [],
		questionType: "Text",
		tips: "",
	},
	{
		question: "Votre adresse email",
		slug: "email",
		answers: [],
		questionType: "Text",
		tips: "",
	},
	{
		question: "Une dernière étape...",
		slug: "password",
		answers: [],
		questionType: "Password",
		tips: "",
	},
];
