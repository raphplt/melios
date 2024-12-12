import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import { View } from "react-native";
import * as Progress from "react-native-progress";

const LevelDetail = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { selectedLevel } = useData();
	if (!selectedLevel) return null;
	return (
		<View>
			<View
				style={{
					backgroundColor: selectedLevel.color || theme.colors.background,
				}}
				className="absolute top-0 left-0 right-0 h-48 w-full"
			></View>
			<View
				className="flex flex-col items-center justify-center w-10/12 mx-auto mt-20 rounded-xl py-10"
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
			>
				<Text className="text-lg font-semibold">{selectedLevel.name}</Text>
				<Text className="text-[16px] font-semibold">
					{t("lvl")} {selectedLevel.currentLevel}
				</Text>

				<View className="mt-5">
					<Text className="font-semibold mb-2">
						{selectedLevel.currentXp} / {selectedLevel.nextLevelXp}
					</Text>
				</View>
				<Progress.Bar
					progress={selectedLevel.currentXp / selectedLevel.nextLevelXp}
					height={8}
					width={300}
					color={selectedLevel.color || theme.colors.primary}
				/>
			</View>
		</View>
	);
};

export default LevelDetail;
