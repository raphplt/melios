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
import { HabitType } from "@utils/category.type";
import useAddXp from "@hooks/useAddXp";
import RestartHabit from "@components/Modals/RestartHabit";
import { Iconify } from "react-native-iconify";
import { useLeaguePointsWithPromotion } from "@hooks/useLeaguePointsWithPromotion";

export default function ButtonComplete() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { currentHabit } = useHabits();
	const { date, setCompletedHabitsToday, setStreak, member, setMember } =
		useData();
	const { addOdysseePoints } = usePoints();
	const addXp = useAddXp()?.addXp;
	const { addPointsAndCheckPromotion } = useLeaguePointsWithPromotion();
	const [showModalNegative, setShowModalNegative] = useState(false);

	const [loading, setLoading] = useState(false);

	if (!currentHabit) return null;

	const handlePress = async () => {
		setLoading(true);
		await setHabitLog(currentHabit.id, date);
		if (currentHabit.type !== HabitType.negative) {
			addXp && addXp(currentHabit, 10 * currentHabit.difficulty);

			addOdysseePoints(currentHabit.difficulty);
			setRewards("odyssee", currentHabit.difficulty * 2);

			setCompletedHabitsToday((prev) => [...prev, currentHabit]);

			if (member && member.uid) {
				const pointsToAdd = currentHabit.difficulty * 10;
				await addPointsAndCheckPromotion(member, pointsToAdd, setMember);
			}

			const streak = await incrementStreak();
			if (streak) {
				setStreak(streak);
			}

			navigation.navigate("(navbar)");
			setLoading(false);
		} else {
			setShowModalNegative(true);
			setLoading(false);
		}
	};

	return (
		<>
			<ZoomableView>
				<Pressable
					onPress={handlePress}
					className="py-4 px-4 rounded-full mx-2 justify-evenly flex flex-row items-center"
					style={{
						backgroundColor: theme.colors.backgroundSecondary,
					}}
				>
					<View className="flex flex-row items-center">
						{loading ? (
							<ActivityIndicator size="small" color={theme.colors.primary} />
						) : (
							<View className="flex flex-row items-center justify-center">
								<Text
									className="font-semibold text-[16px] mx-1"
									style={{
										color: theme.colors.text,
									}}
								>
									{currentHabit.type === HabitType.negative
										? t("restart")
										: t("complete")}
								</Text>
							</View>
						)}
					</View>
				</Pressable>
			</ZoomableView>
			<RestartHabit
				visible={showModalNegative}
				setVisible={setShowModalNegative}
				habit={currentHabit}
			/>
		</>
	);
}
