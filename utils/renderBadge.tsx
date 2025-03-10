export const badges: { [key: string]: any } = {
	level1: require("@assets/images/badges/Level-1.png"),
	level2: require("@assets/images/badges/Level-2.png"),
	level3: require("@assets/images/badges/Level-3.png"),
	level4: require("@assets/images/badges/Level-4.png"),
	level5: require("@assets/images/badges/Level-5.png"),
	level6: require("@assets/images/badges/Level-6.png"),
	level7: require("@assets/images/badges/Level-7.png"),
	level8: require("@assets/images/badges/Level-8.png"),
	level9: require("@assets/images/badges/Level-9.png"),
};

export const levelsBadge = (level: number) => {
	if (level >= 30) return badges.level9;
	if (level >= 20) return badges.level8;
	if (level >= 15) return badges.level7;
	if (level >= 10) return badges.level6;
	if (level >= 7) return badges.level5;
	if (level >= 5) return badges.level4;
	if (level >= 3) return badges.level3;
	if (level >= 1) return badges.level2;
	return badges.level1;
};