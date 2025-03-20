import Tasks from "@components/Levels/Tasks";
import ButtonClose from "@components/Shared/ButtonClose";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { getLevelName } from "@utils/levels";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Text,
	View,
	Platform,
	StatusBar,
	ScrollView,
	Dimensions,
} from "react-native";
import * as Progress from "react-native-progress";

const LevelDetail = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { selectedLevel } = useData();

	if (!selectedLevel) return null;
	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
			<StatusBar
				barStyle={theme.dark ? "light-content" : "dark-content"}
				backgroundColor={"transparent"}
			/>
			<View
				style={{
					paddingTop: 40,
					zIndex: 10,
				}}
			>
				<ButtonClose />
			</View>

			<LinearGradient
				colors={[
					lightenColor(selectedLevel.color, 0.7) || theme.colors.primary,
					theme.colors.background,
				]}
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: Dimensions.get("screen").height * 0.5,
					width: "100%",
				}}
			/>
			<BlurView
				className="flex flex-col items-center justify-center w-11/12 mx-auto rounded-xl py-6 gap-1"
				style={{
					overflow: "hidden",
				}}
				intensity={100}
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
						backgroundColor: selectedLevel.color ?? theme.colors.primary,
						elevation: 3,
					}}
					className="px-5 py-2 rounded-full mt-4"
				>
					<Text
						className="font-semibold text-[16px] text-center"
						style={{
							color: theme.colors.textSecondary,
						}}
					>
						{getLevelName(selectedLevel.currentLevel)}
					</Text>
				</View>

				<View className="mt-2 flex flex-row w-[85%] justify-between items-center">
					<Text
						className="font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						{t("lvl")} {selectedLevel.currentLevel}
					</Text>
					<View className="flex flex-row items-center gap-2">
						<Text
							className="font-bold"
							style={{
								color: theme.colors.text,
							}}
						>
							{selectedLevel.currentLevel + 2}
						</Text>
						<MoneyMelios width={18} />
					</View>
				</View>
				<Progress.Bar
					progress={selectedLevel.currentXp / selectedLevel.nextLevelXp}
					height={14}
					width={Dimensions.get("window").width * 0.8}
					unfilledColor={theme.colors.border}
					borderColor="transparent"
					borderWidth={0}
					borderRadius={10}
					color={selectedLevel.color || theme.colors.primary}
				/>
			</BlurView>

			<Tasks />
		</ScrollView>
	);
};

export default LevelDetail;
