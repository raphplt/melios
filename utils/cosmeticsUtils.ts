export default function getIcon(slug: string) {
	const images: { [key: string]: string } = {
		apollon: "images/cosmetics/apollon.png",
		dyonisos: "images/cosmetics/dyonisos.png",
		hades: "images/cosmetics/hades.png",
		hephaistos: "images/cosmetics/hephaistos.png",
		man: "images/cosmetics/man.png",
		owl_warrior: "images/cosmetics/owl_warrior.png",
		poseidon: "images/cosmetics/poseidon.png",
		priestess: "images/cosmetics/priestess.png",
		soldier: "images/cosmetics/soldier.png",
		warrior_woman: "images/cosmetics/warrior_woman.png",
		woman: "images/cosmetics/woman.png",
		zeus: "images/cosmetics/zeus.png",
	};

	return images[slug] || "images/cosmetics/man.png";
}
