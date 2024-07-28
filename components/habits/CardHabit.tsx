import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import Checkbox from "expo-checkbox";
import { setMemberHabit } from "../../db/member";
import { getMemberHabit } from "../../db/member";
import { lightenColor } from "../../utils/colors";
import { useData } from "../../context/DataContext";

export default function CardHabit({ habit, navigation }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const { setUncompletedHabitsData, setCompletedHabitsData } = useData();

	const setHabit = async () => {
		await setMemberHabit(habit);

		if (toggleCheckBox) {
			setUncompletedHabitsData((prev: any) =>
				prev.filter((h: any) => h.id !== habit.id)
			);
		} else {
			setUncompletedHabitsData((prev: any) => [...prev, habit]);
		}
		setToggleCheckBox(!toggleCheckBox);
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
