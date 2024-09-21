import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { CombinedHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getHabitPoints } from "@utils/pointsUtils";
import { useNavigation } from "expo-router";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import RewardDetail from "./RewardDetail";
import { Iconify } from "react-native-iconify";

export default function ButtonComplete({
	combinedHabit,
}: {
	combinedHabit: CombinedHabits;
}) {
	const { theme } = useContext(ThemeContext);
	const { startTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handleTouchStart = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleTouchEnd = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	const handlePress = () => {
		startTimer(combinedHabit);
		navigation.navigate("timerHabit");
	};

	const habitPoints = getHabitPoints(combinedHabit.habit);

	return (
		<>
			<View className="flex flex-row items-center justify-between w-11/12 mx-auto py-3 ">
				<Text
					className=" font-semibold text-[16px]"
					style={{
						color: theme.colors.text,
					}}
				>
					Compléter l'habitude
				</Text>
				<View className="flex flex-row ">
					<RewardDetail point={habitPoints.odyssee} money={<MoneyOdyssee />} />
				</View>
			</View>
			<Animated.View
				style={{
					transform: [{ scale: scaleAnim }],
				}}
			>
				<Pressable
					onPress={handlePress}
					className="py-3 px-4 rounded-lg w-11/12 mx-auto justify-evenly flex flex-row items-center"
					style={{
						backgroundColor: theme.colors.backgroundSecondary,
					}}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onTouchCancel={handleTouchEnd}
				>
					<Iconify icon="gg:check-o" size={24} color={theme.colors.text} />
				</Pressable>
			</Animated.View>
		</>
	);
}