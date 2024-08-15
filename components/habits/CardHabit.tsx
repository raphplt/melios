import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import Checkbox from "expo-checkbox";
import { setMemberHabit } from "../../db/member";
import { getMemberHabit } from "../../db/member";
import { lightenColor } from "../../utils/colors";
import { useData } from "../../context/DataContext";
import { Habit } from "../../types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_MEMBER_HABITS_KEY } from "../../db/member";

export default function CardHabit({ habit }: { habit: Habit }) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const { setUncompletedHabitsData } = useData();

	const setHabit = async () => {
		setToggleCheckBox(!toggleCheckBox);
		await setMemberHabit(habit);

		if (toggleCheckBox) {
			setUncompletedHabitsData((prev: Habit[]) =>
				prev.filter((h: Habit) => h.id !== habit.id)
			);
		} else {
			setUncompletedHabitsData((prev: Habit[]) => [...prev, habit]);
		}

		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let habits = storedHabits ? JSON.parse(storedHabits) : [];

		if (toggleCheckBox) {
			habits = habits.filter((h: Habit) => h.id !== habit.id);
		} else {
			habits.push(habit);
		}

		await AsyncStorage.setItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY,
			JSON.stringify(habits)
		);
	};

	useEffect(() => {
		(async () => {
			const hasHabit = await getMemberHabit(habit.id);
			setToggleCheckBox(hasHabit ? true : false);
		})();
	}, []);

	const lightenedColor = lightenColor(habit.category.color, 0.1);

	return (
		<TouchableOpacity onPress={setHabit}>
			<View className="w-full mx-auto my-1 flex flex-row items-center justify-evenly">
				<View>
					<Checkbox
						value={toggleCheckBox}
						// disabled
						onValueChange={setHabit}
						color={habit.category.color || theme.colors.primary}
					/>
				</View>
				<View
					className="flex items-center flex-row bg-gray-200 py-2 rounded-lg basis-4/5"
					style={{
						backgroundColor: lightenedColor,
						borderColor: habit.category.color || theme.colors.text,
						borderWidth: 1,
					}}
				>
					<Text className="font-semibold" style={{ marginLeft: 15 }}>
						{habit.moment}h
					</Text>
					<Text
						style={{ color: theme.colors.text }}
						className="ml-2 text-[15px] line-clamp-2 w-3/4"
					>
						{habit.name}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
