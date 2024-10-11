import React, { memo, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

// Customs imports
import usePoints from "@hooks/usePoints";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { getHabitLogs, setHabitLog } from "@db/logs";

const formatDate = (date: Date) => {
	return date.toISOString().split("T")[0];
};

function CardCheckHabit({
	habit,
	onHabitStatusChange,
	completed,
}: {
	habit: UserHabit;
	onHabitStatusChange?: (habit: UserHabit, completed: boolean) => void;
	completed?: boolean;
}) {
	const { theme } = useTheme();
	const { setCurrentHabit } = useHabits();
	const { addOdysseePoints } = usePoints();
	const { date, setCompletedHabitsToday } = useData();

	// États
	const [habitLogs, setHabitLogs] = useState<Array<string>>();
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [isTouched, setIsTouched] = useState(false);
	let touchStartTimeout: NodeJS.Timeout;

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

	useEffect(() => {
		const getLog = async () => {
			const snapshot = await getHabitLogs(habit.id);
			setHabitLogs(snapshot);
		};
		getLog();
	}, []);

	useEffect(() => {
		const today = formatDate(new Date());
		if (!habitLogs) return;
		if (habitLogs.includes(today)) {
			setToggleCheckBox(true);
		} else {
			setToggleCheckBox(false);
		}
	}, [habitLogs]);

	const goHabitDetail = () => {
		setCurrentHabit(habit);
		navigation.navigate("habitDetail");
	};

	const setHabitDone = async () => {
		setToggleCheckBox(true);

		try {
			await setHabitLog(habit.id, date);

			addOdysseePoints(habit.difficulty);

			setCompletedHabitsToday((prev) => [...prev, habit]);
		} catch (error) {
			console.error("Erreur lors de l'ajout du log :", error);
		}

		if (onHabitStatusChange) {
			onHabitStatusChange(habit, true);
		}
	};

	return (
		<Animated.View
			style={[animatedStyles]}
			className="w-11/12 mx-auto my-[5px] flex flex-row items-center justify-between"
		>
			<Pressable
				onPress={setHabitDone}
				className="flex items-center justify-center"
				disabled={toggleCheckBox}
				style={{ flexBasis: "12.5%" }}
			>
				<Ionicons
					name={toggleCheckBox ? "checkmark-circle" : "ellipse-outline"}
					size={30}
					color={theme.colors.primary}
				/>
			</Pressable>
			<Pressable
				onPress={() => {
					goHabitDetail();
				}}
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				className="flex-1 rounded-xl"
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
					className="flex items-center flex-row justify-between px-3 py-[13px] rounded-xl"
					style={{
						backgroundColor:
							isTouched || completed
								? theme.colors.backgroundTertiary
								: theme.colors.cardBackground,
					}}
				>
					<View className="flex flex-row items-center justify-between w-full">
						<Text
							style={{
								color: theme.colors.text,
								textDecorationLine: completed ? "line-through" : "none",
								marginLeft: 6,
							}}
							className="text-[16px] font-semibold w-[80%]"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
						<FontAwesome6
							name={habit.icon || "question"}
							size={18}
							color={habit.color || theme.colors.text}
						/>
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}

export default memo(CardCheckHabit);
