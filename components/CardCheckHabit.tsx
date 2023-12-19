import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import Checkbox from "expo-checkbox";
import { setMemberHabit, setMemberHabitLog } from "../db/member";
import { getMemberHabit } from "../db/member";
import moment from "moment";

export default function CardCheckHabit({ habit, navigation }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	const setHabitDone = async () => {
		await setMemberHabitLog(habit.id, date, true);

		setToggleCheckBox(!toggleCheckBox);
	};

	useEffect(() => {
		(async () => {
			const snapshot = await getMemberHabit(habit.id);
			await setMemberHabitLog(habit.id, date, false);

			// console.log("SNAPSHOT", snapshot);
			// console.log("DONE", snapshot.logs[date] && snapshot.logs[date].done);

			console.log("SNAPSHOT", snapshot.logs[0].done);
			setToggleCheckBox(
				snapshot.logs[date] && snapshot.logs[date].done ? true : false
			);
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
				<Text style={{ color: theme.colors.text }}>
					{habit.logs[0].done == false ? "false" : "true"}
				</Text>
			</View>
			<View>
				<Checkbox value={toggleCheckBox} onValueChange={setHabitDone} />
			</View>
		</View>
	);
}
