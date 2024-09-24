import { formatTime } from "./timeUtils";

export const message = ({
	currentTime,
	totalTime,
}: {
	currentTime: number;
	totalTime: number;
}) => {
	const progress = 1 - Math.round((currentTime / totalTime) * 100);
	if (progress < 10) {
		return "Vous venez de commencer, continuez comme ça !";
	}
	if (progress < 25) {
		return "Bon début, continuez à avancer !";
	}
	if (progress < 50) {
		return "Vous êtes à mi-chemin, continuez votre bon travail !";
	}
	if (progress < 75) {
		return "Vous avez fait beaucoup de progrès, continuez !";
	}
	if (progress < 90) {
		return "Presque terminé, continuez votre effort !";
	}
	if (progress < 100) {
		return "Vous êtes sur le point de finir, continuez jusqu'au bout !";
	}
};
