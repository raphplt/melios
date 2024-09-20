export default function getIcon(slug: string) {
	const images: { [key: string]: any } = {
		apollon: require("@assets/images/cosmetics/apollon.png"),
		dyonisos: require("@assets/images/cosmetics/dyonisos.png"),
		hades: require("@assets/images/cosmetics/hades.png"),
		hephaistos: require("@assets/images/cosmetics/hephaistos.png"),
		man: require("@assets/images/cosmetics/man.png"),
		owl_warrior: require("@assets/images/cosmetics/owl_warrior.png"),
		poseidon: require("@assets/images/cosmetics/poseidon.png"),
		priestess: require("@assets/images/cosmetics/priestess.png"),
		soldier: require("@assets/images/cosmetics/soldier.png"),
		warrior_woman: require("@assets/images/cosmetics/warrior_woman.png"),
		woman: require("@assets/images/cosmetics/woman.png"),
		zeus: require("@assets/images/cosmetics/zeus.png"),
	};
	return images[slug] || require("@assets/images/cosmetics/man.png");
}
