export const customMessage = (type: string) => {
	switch (type) {
		case "Positif":
			return "Instaurez une nouvelle habitude dans votre quotidien, vous êtes sur la bonne voie";
		case "Négatif":
			return "Laissez derrière vous une habitude qui vous empêche d'avancer";
		case "Personnalisé":
			return "Créez une habitude qui vous ressemble, vous êtes unique";
		default:
			return "Faites une activité qui vous fait du bien";
	}
};
