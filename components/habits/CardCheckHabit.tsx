import React, { useContext, useEffect, useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "react-native";
import Checkbox from "expo-checkbox";
import moment from "moment";
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
import { useData } from "@context/DataContext";
import CardPlaceHolder from "./CardPlaceHolder";
import { useProgression } from "@hooks/useProgression";

export default function CardCheckHabit({
	habit = [],
	onHabitStatusChange,
	completed,
	disabled,
}: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitInfos, setHabitInfos] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [isTouched, setIsTouched] = useState(false);
	let touchStartTimeout: NodeJS.Timeout;

	const { addOdysseePoints } = usePoints();
	const { updateTodayScore } = useProgression();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);
	const { popup } = useData();

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
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 500 });
		return () => {
			opacity.value = withTiming(0, { duration: 500 });
		};
	}, []);

	useEffect(() => {
		if (completed) {
			setToggleCheckBox(true);
		}
	}, [completed]);

	const setHabitDone = async () => {
		setToggleCheckBox(true);
		// popup.newPopup("Bravo !", "success");
		onHabitStatusChange(habit, true);
		translateX.value = withSpring(toggleCheckBox ? 100 : 0);
		await setMemberHabitLog(habit.id, date, true);
		await setRewards("odyssee", habitInfos.reward + habitInfos.difficulty);
		addOdysseePoints(habitInfos.reward, habitInfos.difficulty);
		updateTodayScore();
	};

	if (loading) return <CardPlaceHolder />;

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
					color={theme.colors.primary}
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
