import React, { useContext, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";

// Customs imports
import { getHabitById } from "@db/habits";
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";
import { ThemeContext } from "@context/ThemeContext";
import { difficulties } from "@utils/habitsUtils";
import { DataContext } from "@context/DataContext";
import CardPlaceHolder from "./CardPlaceHolder";
import { useProgression } from "@hooks/useProgression";
import { Habit } from "../../types/habit";

export default function CardCheckHabit({
	habit,
	onHabitStatusChange,
	completed,
	disabled,
}: {
	habit: Habit;
	onHabitStatusChange: (habit: Habit, completed: boolean) => void;
	completed: boolean;
	disabled: boolean;
}) {
	// Imports et Contextes
	const { theme } = useContext(ThemeContext);
	const { date } = useContext(DataContext);

	// États
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [habitInfos, setHabitInfos] = useState<Habit>();
	const [loading, setLoading] = useState(true);
	const [isTouched, setIsTouched] = useState(false);

	// Variables
	let touchStartTimeout: NodeJS.Timeout;

	// Hooks personnalisés
	const { addOdysseePoints } = usePoints();
	const { updateTodayScore } = useProgression();

	// Navigation
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	// Animations
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		};
	});

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
			setLoading(false);
		}
		getHabitInfos();
	}, []);

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 200 });
		return () => {
			opacity.value = withTiming(0, { duration: 200 });
		};
	}, []);

	useEffect(() => {
		if (completed) {
			setToggleCheckBox(true);
		}
	}, [completed]);

	if (loading || !habitInfos) return <CardPlaceHolder />;

	const setHabitDone = async () => {
		setToggleCheckBox(true); // Optimistic UI
		onHabitStatusChange(habit, true);
		translateX.value = withSpring(toggleCheckBox ? 100 : 0);
		await setMemberHabitLog(habit.id, date, true); // Update DB
		await setRewards("odyssee", habitInfos.reward + habitInfos.difficulty);
		addOdysseePoints(habitInfos.reward, habitInfos.difficulty);
	};

	return (
		<Animated.View
			style={[animatedStyles]}
			className="w-[90%] mx-auto my-[6px] flex flex-row items-center justify-evenly"
		>
			<Pressable
				onPress={setHabitDone}
				className="flex items-center justify-center px-3 py-2"
				disabled={toggleCheckBox}
			>
				<Checkbox
					value={toggleCheckBox}
					onValueChange={setHabitDone}
					color={theme.colors.border}
					disabled={disabled || toggleCheckBox}
				/>
			</Pressable>
			<Pressable
				className="px-3"
				onPress={() => {
					navigation.navigate("habitDetail", {
						habit: JSON.stringify(habit),
						habitInfos: JSON.stringify(habitInfos),
					});
				}}
			>
				<View
					className="flex items-center flex-row justify-around py-2 rounded-xl w-full"
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						backgroundColor: isTouched
							? theme.colors.cardBackground
							: theme.colors.background,
					}}
					onTouchStart={() => {
						touchStartTimeout = setTimeout(() => setIsTouched(true), 200);
					}}
					onTouchEnd={() => {
						clearTimeout(touchStartTimeout);
						setIsTouched(false);
					}}
					onTouchCancel={() => {
						clearTimeout(touchStartTimeout);
						setIsTouched(false);
					}}
				>
					<View
						className="absolute py-2 left-[8px] w-[4px] h-full rounded-xl"
						style={{
							backgroundColor: habitInfos.category?.color || theme.colors.primary,
						}}
					></View>
					<View className="flex flex-row">
						<Text
							className="font-semibold"
							numberOfLines={1}
							style={{
								marginLeft: 14,
								color: theme.colors.text,
							}}
						>
							{habit.moment}h
						</Text>

						<Text
							style={{
								color: theme.colors.text,
								textDecorationLine: completed ? "line-through" : "none",
								marginLeft: 6,
							}}
							className="text-[14px] w-3/4"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
					</View>
					<Ionicons
						name="flame"
						size={24}
						color={
							habitInfos.difficulty
								? difficulties[habitInfos?.difficulty - 1][habitInfos?.difficulty]
								: theme.colors.primary
						}
					/>
				</View>
			</Pressable>
		</Animated.View>
	);
}
