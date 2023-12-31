import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import Checkbox from "expo-checkbox";
import { setMemberHabit } from "../db/member";
import { getMemberHabit } from "../db/member";

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

	return (
		<View className="w-11/12 mx-auto  my-2 flex flex-row items-center justify-evenly">
			<View
				className="flex flex-row bg-gray-200 py-2 rounded-xl basis-4/5"
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
			>
				<Image source={habit.image} className="ml-3" />
				<Text style={{ color: theme.colors.text }} className="ml-2 text-[16px]">
					{habit.name}
				</Text>
				<Text style={{ color: theme.colors.text }}>{habit.img}</Text>
			</View>
			<View>
				<Checkbox
					value={toggleCheckBox}
					onValueChange={setHabit}
					color={theme.colors.primary}
				/>
			</View>
		</View>
	);
}
