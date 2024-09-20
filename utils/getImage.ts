export default function getImage(slug: string) {
	const images: { [key: string]: any } = {
		sport: require("@assets/images/categories/sport.jpg"),
		well_being: require("@assets/images/categories/well_being.jpg"),
		fitness: require("@assets/images/categories/fitness.jpg"),
		mental_health: require("@assets/images/categories/mental_health.jpg"),
		food: require("@assets/images/categories/food.jpg"),
		housework: require("@assets/images/categories/housework.jpg"),
		social_life: require("@assets/images/categories/social_life.jpg"),
		manage_budget: require("@assets/images/categories/manage_budget.jpg"),
		grow: require("@assets/images/categories/grow.jpg"),
		creativity: require("@assets/images/categories/creativity.jpg"),
		develop_skill: require("@assets/images/categories/develop_skill.jpg"),
		ecology: require("@assets/images/categories/ecology.jpg"),
		spirituality: require("@assets/images/categories/spirituality.jpg"),
		productivity: require("@assets/images/categories/productivity.jpg"),
	};
	return images[slug] || require("@assets/images/categories/social_life.jpg");
}
