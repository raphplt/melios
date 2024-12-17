import Tasks from "@components/Levels/Tasks";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View, Platform, StatusBar } from "react-native";
import * as Progress from "react-native-progress";

const LevelDetail = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { selectedLevel } = useData();

	if (!selectedLevel) return null;

	return (
		<View>
			<View className="m-10 ml-5 z-10 flex flex-row items-center justify-between w-10/12 mx-auto">
				<ButtonClose />
			</View>

			<LinearGradient
				colors={[
					selectedLevel.color || theme.colors.primary,
					theme.colors.background,
				]}
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
				}}
				className="absolute top-0 left-0 right-0 h-48 w-full"
			></LinearGradient>
			<View
				className="flex flex-col items-center justify-center w-10/12 mx-auto mt-2 rounded-xl py-10"
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
			>
				<Text
					className="text-xl font-semibold w-10/12 mx-auto text-center"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{selectedLevel.name}
				</Text>
				<Text className="text-[16px] mt-2 font-semibold">
					{t("lvl")} {selectedLevel.currentLevel}
				</Text>

				<View className="mt-5 flex flex-row w-10/12 mb-2 justify-between items-center">
					<Text>{t("xp")}</Text>
					<Text className="font-semibold">
						{selectedLevel.currentXp} / {selectedLevel.nextLevelXp}
					</Text>
				</View>
				<Progress.Bar
					progress={selectedLevel.currentXp / selectedLevel.nextLevelXp}
					height={10}
					width={300}
					unfilledColor={theme.colors.border}
					borderColor="transparent"
					borderWidth={0}
					borderRadius={15}
					color={selectedLevel.color || theme.colors.primary}
				/>
			</View>

			<Tasks />
		</View>
	);
};

export default LevelDetail;
