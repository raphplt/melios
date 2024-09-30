import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import {
	CombinedHabits,
	HabitsContext,
	useHabits,
} from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getHabitPoints } from "@utils/pointsUtils";
import { useNavigation } from "expo-router";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import RewardDetail from "./RewardDetail";
import { Iconify } from "react-native-iconify";

export default function ButtonComplete() {
	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { currentHabit } = useHabits();

	if (!currentHabit) return null;

	const { startTimer } = useHabitTimer();

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
		startTimer(currentHabit);
		navigation.navigate("timerHabit");
	};

	const habitPoints = getHabitPoints(currentHabit);

	return (
		<>
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
					<View className="flex flex-row items-center">
						<Text
							className="font-semibold text-[16px] mx-1"
							style={{
								color: theme.colors.text,
							}}
						>
							Compléter
						</Text>
						<RewardDetail point={habitPoints.odyssee} money={<MoneyOdyssee />} />
					</View>
				</Pressable>
			</Animated.View>
		</>
	);
}
