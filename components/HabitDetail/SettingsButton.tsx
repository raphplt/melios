import DeleteHabit from "@components/Modals/DeleteHabit";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import {
	deleteHabitById,
	LOCAL_STORAGE_MEMBER_HABITS_KEY,
} from "@db/userHabit";
import useIndex from "@hooks/useIndex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import { useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { Animated, View } from "react-native";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import {
	useAnimatedStyle,
	withTiming,
	withDelay,
	useSharedValue,
} from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

export default function ButtonBack() {
	const { theme } = useTheme();
	const { setHabits } = useData();

	const { currentHabit } = useHabits();
	const [menuVisible, setMenuVisible] = useState(false);
	const opacity = useSharedValue(0);
	const translateY = useSharedValue(-10);
	const { rotate, handlePressIn, handlePressOut } = useIndex();
	const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	if (!currentHabit) return null;

	useEffect(() => {
		if (menuVisible) {
			opacity.value = withDelay(100, withTiming(1, { duration: 200 }));
			translateY.value = withDelay(100, withTiming(0, { duration: 200 }));
		} else {
			opacity.value = withTiming(0, { duration: 200 });
			translateY.value = withTiming(-10, { duration: 200 });
		}
	}, [menuVisible]);

	const deleteHabit = async (habit: UserHabit) => {
		const habitId = habit.id;
		if (habitId) deleteHabitById(habitId);

		setHabits((prev: UserHabit[]) =>
			prev.filter((h: UserHabit) => h.id !== habit.id)
		);

		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let localHabits = storedHabits ? JSON.parse(storedHabits) : [];
		localHabits = localHabits.filter((h: Habit) => h.id !== habit.id);
	};

	const confirmDelete = async () => {
		deleteHabit(currentHabit);
		setModalDeleteVisible(false);
		navigation.goBack();
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateY: translateY.value }],
		};
	});

	const buttonStyle =
		"px-1 mx-1 rounded-2xl w-fit flex flex-row items-center justify-center";

	return (
		<>
			<View className="flex flex-row items-center justify-end py-1">
				{menuVisible && (
					<Reanimated.View
						className="flex flex-row items-center justify-center w-fit mx-2"
						style={[animatedStyle]}
					>
						<Pressable
							className={buttonStyle}
							onPress={() => {
								/* Action pour éditer */
							}}
						>
							<Iconify icon="mdi:pencil" size={24} color={theme.colors.text} />
						</Pressable>
						<Pressable
							className={buttonStyle}
							onPress={() => {
								setModalDeleteVisible(true);
							}}
						>
							<Iconify icon="mdi:trash-can" size={24} color={theme.colors.text} />
						</Pressable>
					</Reanimated.View>
				)}
				<Animated.View style={{ transform: [{ rotate }] }}>
					<Pressable
						onPress={() => setMenuVisible(!menuVisible)}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						className="px-1"
					>
						<Iconify
							icon="material-symbols:settings"
							size={24}
							color={theme.colors.text}
						/>
					</Pressable>
				</Animated.View>
			</View>
			<DeleteHabit
				visible={modalDeleteVisible}
				setVisible={setModalDeleteVisible}
				handleDelete={() => {
					confirmDelete();
				}}
				habit={currentHabit}
			/>
		</>
	);
}
