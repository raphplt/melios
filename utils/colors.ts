import tinycolor from "tinycolor2";

export function lightenColor(hex: string, alpha: number = 0.1): string {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
	return hex;
}

export const getFlammeColor = (todayScore: number): string => {
	if (todayScore >= 0 && todayScore < 30) {
		return "#FFD580";
	}
	if (todayScore >= 30 && todayScore < 60) {
		return "#FFB347";
	}
	if (todayScore >= 60 && todayScore < 100) {
		return "#FF6961";
	}
	return "#FFD580";
};

export function getContrastingColor(color: string): string {
	const tc = tinycolor(color);
	console.log("tc", tc, "isLight", tc.isLight(), "color is", color);
	return tc.isLight() ? "#000000" : "#FFFFFF";
}
