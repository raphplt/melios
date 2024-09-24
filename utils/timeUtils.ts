export const formatTime = (seconds: any) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatRemainingTime = (
	elapsedSeconds: number,
	totalSeconds: number
) => {
	const remainingSeconds = totalSeconds - elapsedSeconds;
	const minutes = Math.floor(remainingSeconds / 60);
	const seconds = remainingSeconds % 60;
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const currentHour = new Date().getHours();

export const isDayTime = currentHour >= 6 && currentHour < 20;
