import React, { memo, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withDelay,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";

// Customs imports
import usePoints from "@hooks/usePoints";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { setHabitLog } from "@db/logs";
import useHabitTimer from "@hooks/useHabitTimer";
import ZoomableView from "@components/Shared/ZoomableView";
import { setRewards } from "@db/rewards";
import useAddXp from "@hooks/useAddXp";
import { CategoryTypeSelect } from "@utils/category.type";
import { incrementStreak } from "@db/streaks";
import RestartHabit from "@components/Modals/RestartHabit";
import { useNavigation } from "expo-router";

function CardCheckHabit({
	habit,
	onHabitStatusChange,
}: {
	habit: UserHabit;
	onHabitStatusChange?: (habit: UserHabit, completed: boolean) => void;
}) {
	const { date, completedHabitsToday, setCompletedHabitsToday, setStreak } =
		useData();
	const { theme } = useTheme();
	const { setCurrentHabit } = useHabits();
	const { addOdysseePoints } = usePoints();
	const { startTimer } = useHabitTimer();
	const addXp = useAddXp()?.addXp;
	const { t } = useTranslation();

	// États
	const [showDetails, setShowDetails] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [showModalNegative, setShowModalNegative] = useState(false);

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	// Animations
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);
	const detailsHeight = useSharedValue(0);
	const detailsOpacity = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		};
	});

	const detailsAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: detailsHeight.value,
			opacity: detailsOpacity.value,
		};
	});

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 200 });
		return () => {
			opacity.value = withTiming(0, { duration: 200 });
		};
	}, []);

	useEffect(() => {
		const completed = completedHabitsToday.some((h) => h.id === habit.id);
		setCompleted(completed);
	}, [completedHabitsToday]);

	useEffect(() => {
		if (showDetails) {
			detailsHeight.value = withTiming(70, { duration: 250 });
			detailsOpacity.value = withDelay(100, withTiming(1, { duration: 250 }));
		} else {
			detailsOpacity.value = withTiming(0, { duration: 250 });
			detailsHeight.value = withDelay(200, withTiming(0, { duration: 250 }));
		}
	}, [showDetails]);

	// Fonctions
	const goHabitDetail = () => {
		setCurrentHabit(habit);
		// if (navigation.isr)
		navigation.navigate("habitDetail");
	};

	const startHabit = () => {
		setCurrentHabit(habit);
		startTimer(habit);
		navigation.navigate("timerHabit");
	};

	const setHabitDone = async () => {
		try {
			setCompleted(true);
			await setHabitLog(habit.id, date);

			if (habit.type !== CategoryTypeSelect.negative) {
				if (addXp) {
					await addXp(habit, 10 * habit.difficulty);
				}

				// set points
				addOdysseePoints(habit.difficulty); // set local points
				setRewards("odyssee", habit.difficulty * 2); // set database points

				// set streak
				const streak = await incrementStreak();
				if (streak) {
					setStreak(streak);
				}
			}
			setCompletedHabitsToday((prev) => [...prev, habit]);
		} catch (error) {
			console.error("Erreur lors de l'ajout du log :", error);
		}

		if (onHabitStatusChange) {
			onHabitStatusChange(habit, true);
		}
	};

	const isNegative = habit.type === CategoryTypeSelect.negative;

	const handlePress = () => {
		if (isNegative) {
			setShowModalNegative(true);
		} else {
			setHabitDone();
		}
	};

	return (
		<ZoomableView>
			<Animated.View
				style={[animatedStyles]}
				className="w-11/12 mx-auto my-[5px] flex flex-row items-center justify-between"
			>
				<Pressable
					onPress={handlePress}
					className="flex items-center justify-center"
					disabled={completed}
					style={{ flexBasis: "12.5%" }}
				>
					<Ionicons
						name={completed ? "checkmark-circle" : "ellipse-outline"}
						size={30}
						color={isNegative ? theme.colors.redPrimary : theme.colors.primary}
					/>
				</Pressable>
				<Pressable
					onPress={() => {
						setShowDetails(!showDetails);
					}}
					style={{
						backgroundColor: completed
							? isNegative
								? theme.colors.redSecondary
								: theme.colors.backgroundTertiary
							: theme.colors.cardBackground,
						borderColor: isNegative
							? theme.colors.redPrimary
							: theme.colors.cardBackground,
						borderWidth: 2,
					}}
					className="flex-1 flex flex-col rounded-xl"
				>
					<View className="flex items-center flex-row justify-between px-3 py-[13px] w-full">
						<View className="flex flex-row items-center justify-start">
							<FontAwesome6
								name={habit.icon || "question"}
								size={18}
								color={habit.color || theme.colors.text}
							/>
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold w-[85%] ml-2"
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{habit.name}
							</Text>
						</View>
						<Pressable
							onPress={() => setShowDetails(!showDetails)}
							className="flex items-center justify-center relative"
						>
							{showDetails ? (
								<Iconify icon="mdi:chevron-up" color={theme.colors.text} size={24} />
							) : (
								<Iconify icon="mdi:chevron-down" color={theme.colors.text} size={24} />
							)}
						</Pressable>
					</View>
					<Animated.View style={[detailsAnimatedStyle]}>
						{showDetails && (
							<View className="flex flex-row items-center justify-around">
								<Pressable
									onPress={goHabitDetail}
									className="flex flex-row items-center justify-center py-3 px-5 rounded-2xl w-2/5"
									style={{
										backgroundColor: theme.colors.background,
										borderWidth: 2,
										borderColor: theme.colors.primary,
									}}
								>
									<Iconify
										icon="mdi:information"
										color={theme.colors.primary}
										size={20}
									/>
									<Text
										className="text-[16px] font-semibold ml-2"
										style={{ color: theme.colors.primary }}
									>
										{t("details")}
									</Text>
								</Pressable>

								{!completed && habit.duration ? (
									<Pressable
										onPress={isNegative ? setHabitDone : startHabit}
										className="flex flex-row items-center justify-center py-3 px-5 rounded-2xl w-2/5"
										style={{
											backgroundColor: theme.colors.primary,
											borderWidth: 2,
											borderColor: theme.colors.primary,
										}}
									>
										{isNegative ? (
											<Iconify icon="ri:reset-right-fill" color="white" size={20} />
										) : (
											<Iconify icon="bi:play" color="white" size={20} />
										)}
										<Text className="text-[16px] text-white font-semibold ml-2">
											{habit.type === CategoryTypeSelect.negative
												? t("relaunch")
												: t("start")}
										</Text>
									</Pressable>
								) : (
									<View
										className="flex flex-row items-center justify-center py-3 px-5 rounded-2xl w-2/5"
										style={{
											backgroundColor: theme.colors.primary,
											borderWidth: 2,
											borderColor: theme.colors.primary,
										}}
									>
										<Iconify icon="bi:check" color="white" size={20} />
										<Text className="text-[16px] font-semibold ml-2 text-white">
											{t("done")}
										</Text>
									</View>
								)}
							</View>
						)}
					</Animated.View>
				</Pressable>
			</Animated.View>
			<RestartHabit
				visible={showModalNegative}
				setVisible={setShowModalNegative}
				habit={habit}
			/>
		</ZoomableView>
	);
}

export default memo(CardCheckHabit);
