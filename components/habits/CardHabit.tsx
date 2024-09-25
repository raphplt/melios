import { useContext, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Iconify } from "react-native-iconify";

// Custom imports
import { lightenColor } from "@utils/colors";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import {
	setMemberHabit,
	LOCAL_STORAGE_MEMBER_HABITS_KEY,
	getMemberHabit,
} from "@db/member";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";

export default function CardHabit({ habit }: { habit: Habit }) {
	console.log("CardHabit", habit);
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const { setUncompletedHabitsData, setHabits } = useData();

	const setHabit = async () => {
		const newToggleValue = !toggleCheckBox;
		setToggleCheckBox(newToggleValue);

		await setMemberHabit(habit);

		// Met à jour la liste des habitudes non complétées
		if (newToggleValue) {
			setUncompletedHabitsData((prev: UserHabit[]) => [...prev, habit]);
		} else {
			setUncompletedHabitsData((prev: UserHabit[]) =>
				prev.filter((h: UserHabit) => h.id !== habit.id)
			);
		}

		// Met à jour la liste globale des habitudes dans le contexte
		if (newToggleValue) {
			setHabits((prev: UserHabit[]) => [...prev, habit]);
		} else {
			setHabits((prev: UserHabit[]) =>
				prev.filter((h: UserHabit) => h.id !== habit.id)
			);
		}

		// Mise à jour du stockage local (AsyncStorage)
		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let localHabits = storedHabits ? JSON.parse(storedHabits) : [];

		if (newToggleValue) {
			localHabits.push(habit);
		} else {
			localHabits = localHabits.filter((h: Habit) => h.id !== habit.id);
		}

		await AsyncStorage.setItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY,
			JSON.stringify(localHabits)
		);
	};

	useEffect(() => {
		(async () => {
			const hasHabit = await getMemberHabit(habit.id);
			setToggleCheckBox(hasHabit ? true : false);
		})();
	}, []);

	const lightenedColor = lightenColor(habit.category.color, 0.05);

	return (
		<Pressable onPress={setHabit}>
			<View className="w-full mx-auto my-1 flex flex-row items-center justify-evenly">
				<View>
					<Checkbox
						value={toggleCheckBox}
						onValueChange={setHabit}
						color={habit.category.color || theme.colors.primary}
					/>
				</View>
				<View
					className="flex items-center justify-between flex-row py-2 rounded-lg basis-5/6"
					style={{
						backgroundColor: lightenedColor,
						borderColor: habit.category.color || theme.colors.text,
						borderWidth: 1,
					}}
				>
					<Text
						style={{ color: habit.category.color }}
						className="text-[14px] w-3/5 ml-3 font-semibold"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{habit.name}
					</Text>
					<View className="flex items-center justify-between flex-row mr-3">
						<Iconify
							icon="carbon:time"
							color={habit.category.color || theme.colors.text}
							size={20}
						/>
						<Text
							className=" font-semibold w-6 text-end ml-1"
							style={{ color: habit.category.color || theme.colors.text }}
						>
							{habit.moment}h
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
}
