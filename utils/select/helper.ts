export const getTypeIcon = (type: string) => {
	switch (type) {
		case "Positif":
			return "check-circle";
		case "Négatif":
			return "times-circle";
		default:
			return "question-circle";
	}
};

export const getPeriodFromMoment = (moment: number) => {};