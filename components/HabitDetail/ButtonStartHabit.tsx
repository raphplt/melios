import MoneyMelios from "@components/Svg/MoneyMelios";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getHabitPoints } from "@utils/pointsUtils";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import RewardDetail from "./RewardDetail";
import React from "react";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTranslation } from "react-i18next";

export default function ButtonStartHabit() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { startTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { currentHabit } = useHabits();

	if (!currentHabit) return null;

	const handlePress = () => {
		startTimer(currentHabit);
		navigation.navigate("timerHabit");
	};

	const habitPoints = getHabitPoints(currentHabit);

	return (
		<ZoomableView>
			<Pressable
				onPress={handlePress}
				className="py-3 px-4 rounded-lg w-11/12 mx-auto justify-evenly flex flex-row items-center"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<View className="flex flex-row items-center">
					<Text className=" font-semibold text-[16px] text-white mx-1">
						{t("launch")}
					</Text>
					<RewardDetail
						point={habitPoints.rewards}
						money={<MoneyMelios />}
						color={theme.colors.textSecondary}
					/>
				</View>
			</Pressable>
		</ZoomableView>
	);
}
