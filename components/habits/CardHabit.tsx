import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "../ThemeContext";
import Checkbox from "expo-checkbox";
import { setMemberHabit } from "../../db/member";
import { getMemberHabit } from "../../db/member";

export default function CardHabit({ habit, navigation }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const setHabit = async () => {
		await setMemberHabit(habit);

		setToggleCheckBox(!toggleCheckBox);
	};

	useEffect(() => {
		(async () => {
			const hasHabit = await getMemberHabit(habit.id);
			setToggleCheckBox(hasHabit ? true : false);
		})();
	}, []);

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	const rgb = hexToRgb(habit.category.color);
	const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)` : "#FFFFFF";

	return (
		<TouchableOpacity onPress={setHabit}>
			<View className="w-full mx-auto my-2 flex flex-row items-center justify-evenly">
				<View
					className="flex items-center flex-row bg-gray-200 py-2 rounded-lg basis-4/5"
					style={{
						backgroundColor: rgba,
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
					<Text style={{ color: theme.colors.text }}>{habit.img}</Text>
				</View>
				<View>
					<Checkbox
						value={toggleCheckBox}
						// disabled
						onValueChange={setHabit}
						color={habit.category.color || theme.colors.primary}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
