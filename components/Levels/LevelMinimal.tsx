import React from "react";
import { Text, View } from "react-native";
import { UserLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { genericLevels } from "@constants/levels";
import * as Progress from "react-native-progress";

const LevelMinimal = ({ level }: { level: UserLevel }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const associatedLevel = genericLevels.find((l) => l.id === level.levelId);

	if (associatedLevel?.id === "P0gwsxEYNJATbmCoOdhc") return;
	return (
		<View
			key={level.levelId}
			className="my-2 flex flex-col gap-y-2 items-center justify-center w-1/2"
		>
			<Text style={{ color: theme.colors.text }} className="font-semibold text-sm">
				{/* {t("level")}: {level.id} */}
				{associatedLevel?.name}
			</Text>

			<View className="flex items-center justify-center flex-row">
				<Progress.Circle
					progress={level.currentXp / level.nextLevelXp}
					size={50}
					color={associatedLevel?.color ?? theme.colors.primary}
					borderWidth={0}
					thickness={5}
					unfilledColor={theme.colors.border}
				/>
				<Text
					style={{
						fontSize: 14,
					}}
					className="font-bold absolute text-lg"
				>
					{level.currentLevel}
				</Text>
			</View>
		</View>
	);
};

export default LevelMinimal;
