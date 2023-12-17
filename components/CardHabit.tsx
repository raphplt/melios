import { useContext, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import Checkbox from "expo-checkbox";

export default function CardHabit({ habit, navigation }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	return (
		<View className="w-11/12 mx-auto  my-2 flex flex-row items-center justify-evenly">
			<View
				className="flex flex-row bg-gray-200 py-2 rounded-xl basis-4/5"
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
			>
				<Image source={habit.image} className="ml-3" />
				<Text style={{ color: theme.colors.text }} className="ml-3">
					{habit.title}
				</Text>
				<Text style={{ color: theme.colors.text }}>{habit.img}</Text>
			</View>
			<View>
				<Checkbox value={toggleCheckBox} onValueChange={setToggleCheckBox} />
			</View>
		</View>
	);
}
