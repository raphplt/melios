import React from "react";
import { Text, View } from "react-native";
import { GenericLevel, UserLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

const LevelMinimal = ({ level }: { level: UserLevel }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	return (
		<View key={level.levelId} className="my-2">
			<Text style={{ color: theme.colors.text }}>
				{/* {t("level")}: {level.id} */}
			</Text>
			<Text style={{ color: theme.colors.text }}>
				{t("level")}: {level.currentLevel}
			</Text>
			<Text style={{ color: theme.colors.text }}>
				{t("current_xp")}: {level.currentXp}
			</Text>
			<Text style={{ color: theme.colors.text }}>
				{t("next_level_xp")}: {level.nextLevelXp}
			</Text>
		</View>
	);
};

export default LevelMinimal;
