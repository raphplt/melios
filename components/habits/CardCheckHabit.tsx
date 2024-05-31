import React, { useContext, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "../ThemContext";
import Checkbox from "expo-checkbox";
import { setMemberHabitLog } from "../../db/member";
import moment from "moment";
import { getHabitById } from "../../db/habits";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { setRewards } from "../../db/rewards";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
} from "react-native-reanimated";

export default function CardCheckHabit({
	habit = [],
	onHabitStatusChange,
	completed,
}: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitInfos, setHabitInfos] = useState<any>({});

	const navigation: any = useNavigation();
	const translateX = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		};
	});

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
		}
		getHabitInfos();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const setHabitDone = async () => {
		translateX.value = withSpring(toggleCheckBox ? 100 : 0);

		await setMemberHabitLog(habit.id, date, true);
		await setRewards(habitInfos.difficulty);

		onHabitStatusChange(habit, true);
		setToggleCheckBox(true);

		if (habit.logs) {
			const lastLog = habit.logs[habit.logs.length - 1];
			if (lastLog && lastLog.date === date && lastLog.done === true) {
				setToggleCheckBox(true);
			} else {
				setToggleCheckBox(false);
			}
		} else {
			setToggleCheckBox(false);
		}
	};

	useEffect(() => {
		if (habit.logs) {
			const lastLog = habit.logs[habit.logs.length - 1];
			if (lastLog && lastLog.date === date && lastLog.done === true) {
				setToggleCheckBox(true);
			} else {
				setToggleCheckBox(false);
			}
		} else {
			setToggleCheckBox(false);
		}
	}, []);

	return (
		<Animated.View
			style={[animatedStyles]}
			className="w-11/12 mx-auto my-2 flex flex-row items-center justify-evenly "
		>
			<Pressable
				className="px-2"
				onPress={() => {
					navigation.navigate("habitDetail", {
						habit: habit.name,
						habitInfos: JSON.stringify(habitInfos),
					});
				}}
			>
				<View
					className="flex items-center flex-row justify-around py-2 rounded-xl "
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<View className="flex flex-row">
						<Text
							className="font-semibold"
							style={{
								marginLeft: 5,
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
							className="text-[14px]  w-3/4"
						>
							{habit.name}
						</Text>
					</View>
					<Ionicons
						name="flame"
						size={24}
						color={habitInfos.color || theme.colors.text}
					/>
				</View>
			</Pressable>
			<View className="flex items-center justify-center px-2">
				<Checkbox
					value={toggleCheckBox}
					onValueChange={setHabitDone}
					color={habitInfos.color || theme.colors.primary}
					disabled={
						habit.logs ? habit.logs[habit.logs.length - 1]?.date === date : false
					}
				/>
			</View>
		</Animated.View>
	);
}
