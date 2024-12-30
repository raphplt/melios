import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View, ActivityIndicator, Image } from "react-native";
import { setHabitLog } from "@db/logs";
import { useData } from "@context/DataContext";
import usePoints from "@hooks/usePoints";
import { setRewards } from "@db/rewards";
import React from "react";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTranslation } from "react-i18next";
import { incrementStreak } from "@db/streaks";
import { CategoryTypeSelect } from "@utils/category.type";

export default function ButtonComplete() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { currentHabit } = useHabits();
	const { date, setCompletedHabitsToday, setStreak } = useData();
	const { addOdysseePoints } = usePoints();

	const [loading, setLoading] = useState(false);

	if (!currentHabit) return null;

	const handlePress = async () => {
		setLoading(true);
		await setHabitLog(currentHabit.id, date);
		addOdysseePoints(currentHabit.difficulty);
		setRewards("odyssee", currentHabit.difficulty * 2);

		setCompletedHabitsToday((prev) => [...prev, currentHabit]);

		const streak = await incrementStreak();
		if (streak) {
			setStreak(streak);
		}

		navigation.navigate("index");
		setLoading(false);
	};
	return (
		<ZoomableView>
			<Pressable
				onPress={handlePress}
				className="py-3 px-4 rounded-lg w-11/12 mx-auto justify-evenly flex flex-row items-center"
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<View className="flex flex-row items-center">
					{loading ? (
						<ActivityIndicator size="small" color={theme.colors.primary} />
					) : (
						<>
							<Text
								className="font-semibold text-[16px] mx-1"
								style={{
									color: theme.colors.text,
								}}
							>
								{t("complete")}
							</Text>

							{currentHabit.type !== CategoryTypeSelect.negative && (
								<View className="flex flex-row items-center mx-1">
									<View
										style={{
											width: 28,
											height: 28,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Image
											source={require("@assets/images/badge.png")}
											style={{ width: "100%", height: "100%", position: "absolute" }}
										/>
										<Text className="text-[12px] font-bold text-white text-center">
											{10 * currentHabit.difficulty}
										</Text>
									</View>
									<Text
										style={{
											color: theme.colors.primary,
										}}
										className="text-[12x] font-semibold px-1"
									>
										XP
									</Text>
								</View>
							)}
						</>
					)}
				</View>
			</Pressable>
		</ZoomableView>
	);
}
