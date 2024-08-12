export const formatTime = (seconds: any) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const currentHour = new Date().getHours();

export const isDayTime = currentHour >= 6 && currentHour < 20;