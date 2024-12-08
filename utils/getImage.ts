export default function getImage(slug: string) {
	const images: { [key: string]: string } = {
		sport: "images/categories/sport.jpg",
		well_being: "images/categories/well_being.jpg",
		fitness: "images/categories/fitness.jpg",
		mental_health: "images/categories/mental_health.jpg",
		food: "images/categories/food.jpg",
		housework: "images/categories/housework.jpg",
		social_life: "images/categories/social_life.jpg",
		manage_budget: "images/categories/manage_budget.jpg",
		grow: "images/categories/grow.jpg",
		creativity: "images/categories/creativity.jpg",
		develop_skill: "images/categories/develop_skill.jpg",
		ecology: "images/categories/ecology.jpg",
		spirituality: "images/categories/spirituality.jpg",
		productivity: "images/categories/productivity.jpg",
		default: "images/categories/sport.jpg",
	};
	return images[slug] || "images/categories/social_life.jpg";
}