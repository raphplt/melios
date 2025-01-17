import Tasks from "@components/Levels/Tasks";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
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
		<View
			style={{
				backgroundColor: theme.colors.background,
				flexGrow: 1,
			}}
		>
			<StatusBar
				barStyle={theme.dark ? "light-content" : "dark-content"}
				backgroundColor={"transparent"}
			/>
			<View className=" mb-4 ml-5 z-10 flex flex-row items-center justify-between w-10/12 mx-auto">
				<ButtonClose />
			</View>

			<LinearGradient
				colors={[
					selectedLevel.color || theme.colors.primary,
					theme.colors.background,
				]}
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 300,
					width: "100%",
				}}
			></LinearGradient>
			<View
				className="flex flex-col items-center justify-center w-10/12 mx-auto rounded-xl py-8"
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
			>
				<FontAwesome6
					name={selectedLevel.icon}
					size={40}
					color={selectedLevel.color || theme.colors.primary}
					style={{ marginBottom: 10 }}
				/>
				<Text
					className="text-xl font-semibold w-10/12 mx-auto text-center"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{selectedLevel.name}
				</Text>
				<Text
					className="text-sm mt-2 text-center w-10/12 mx-auto"
					style={{
						color: theme.colors.textTertiary,
					}}
				>
					{selectedLevel.description}
				</Text>
				<View
					style={{
						backgroundColor: theme.colors.primary,
					}}
					className="px-5 py-2 rounded-full mt-4"
				>
					<Text
						className="font-semibold "
						style={{
							color: theme.colors.textSecondary,
						}}
					>
						{t("lvl")} {selectedLevel.currentLevel}
					</Text>
				</View>

				<View className="mt-2 flex flex-row w-10/12 mb-2 justify-between items-center">
					<Text
						className="font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						{t("xp")}
					</Text>
					<Text className="font-semibold">
						{selectedLevel.currentXp} / {selectedLevel.nextLevelXp}
					</Text>
				</View>
				<Progress.Bar
					progress={selectedLevel.currentXp / selectedLevel.nextLevelXp}
					height={12}
					width={300}
					unfilledColor={theme.colors.border}
					borderColor="transparent"
					borderWidth={0}
					borderRadius={10}
					color={selectedLevel.color || theme.colors.primary}
				/>
			</View>

			<Tasks />
		</View>
	);
};

export default LevelDetail;
