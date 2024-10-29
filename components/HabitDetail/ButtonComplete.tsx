import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getHabitPoints } from "@utils/pointsUtils";
import { useNavigation } from "expo-router";
import { useContext, useRef, useState } from "react";
import {
	Animated,
	Pressable,
	Text,
	View,
	ActivityIndicator,
} from "react-native";
import RewardDetail from "./RewardDetail";
import { setHabitLog } from "@db/logs";
import { useData } from "@context/DataContext";
import usePoints from "@hooks/usePoints";
import { setRewards } from "@db/rewards";

export default function ButtonComplete() {
	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { currentHabit } = useHabits();
	const { date, setCompletedHabitsToday } = useData();
	const { addOdysseePoints } = usePoints();

	const [loading, setLoading] = useState(false);

	if (!currentHabit) return null;

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

	const handlePress = async () => {
		setLoading(true);
		await setHabitLog(currentHabit.id, date);
		addOdysseePoints(currentHabit.difficulty);
		setRewards("odyssee", currentHabit.difficulty * 2);

		setCompletedHabitsToday((prev) => [...prev, currentHabit]);

		navigation.navigate("index");
		setLoading(false);
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
						borderColor: theme.colors.primary,
						borderWidth: 2,
					}}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onTouchCancel={handleTouchEnd}
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
									Compléter
								</Text>
								<RewardDetail point={habitPoints.odyssee} money={<MoneyOdyssee />} />
							</>
						)}
					</View>
				</Pressable>
			</Animated.View>
		</>
	);
}