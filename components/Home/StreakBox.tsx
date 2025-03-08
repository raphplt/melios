import { isDayTime } from "@utils/timeUtils";
import { t } from "i18next";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import GradientBox from "./GradientBox";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const StreakBox = () => {
	const { streak, completedHabitsToday } = useData();
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const streakUpdatedToday =
		completedHabitsToday.length ||
		(streak?.updatedAt &&
			new Date(streak.updatedAt).toDateString() === new Date().toDateString());

	const colors: [string, string, ...string[]] = streakUpdatedToday
		? [theme.colors.orangePrimary, theme.colors.orangeSecondary]
		: [theme.colors.border, theme.colors.textSecondary];

	return (
		<GradientBox position={{ bottom: 20, left: 20 }} colors={colors}>
			<View className="flex flex-row items-center gap-2">
				<Pressable
					className="flex flex-row items-center justify-center px-4 py-[10px]"
					onPress={() => navigation.navigate("progression")}
				>
					<Iconify
						icon="bi:fire"
						color={
							isDayTime
								? streakUpdatedToday
									? theme.colors.orangePrimary
									: "black"
								: "white"
						}
						size={20}
					/>
					<Text
						className="font-semibold text-[14px] ml-2"
						style={{ color: isDayTime ? "black" : "white" }}
					>
						{t("streak")} : {streak?.value}{" "}
						{streak && streak?.value > 1 ? t("days") : t("day")}
					</Text>
				</Pressable>
			</View>
		</GradientBox>
	);
};

export default StreakBox;
