export const Questions = [
	{
		question: "Quels sont vos objectifs ?",
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
		answers: [],
		questionType: "Text",
	},
	{
		question: "Quel est votre adresse mail ?",
		answers: [],
		questionType: "Text",
	},
	{
		question: "Quel est votre mot de passe ?",
		answers: [],
		questionType: "Text",
	},
];
