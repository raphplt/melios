import { useContext, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import Checkbox from "expo-checkbox";
import { setMemberHabitLog } from "../db/member";
import moment from "moment";

export default function CardCheckHabit({ habit, onHabitStatusChange }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const setHabitDone = async () => {
		await setMemberHabitLog(habit.id, date, true);
		setToggleCheckBox(!toggleCheckBox);

		onHabitStatusChange(habit.id, true);
	};

	useEffect(() => {
		if (habit.logs) {
			if (
				habit.logs[habit.logs.length - 1] &&
				habit.logs[habit.logs.length - 1].date === date &&
				habit.logs[habit.logs.length - 1].done === true
			) {
				setToggleCheckBox(true);
			} else {
				setToggleCheckBox(false);
			}
		} else {
			setToggleCheckBox(false);
		}
	}, []);

	return (
		<View className="w-11/12 mx-auto  my-2 flex flex-row items-center justify-evenly">
			<View
				className="flex flex-row bg-gray-200 py-2 rounded-xl basis-4/5"
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
			>
				<Image source={habit.image} className="ml-3" />
				<Text
					style={{ color: theme.colors.text }}
					className="ml-2 text-[16px] line-clamp-2 w-3/4"
				>
					{habit.name}
				</Text>
				<Text style={{ color: theme.colors.text }}>{habit.img}</Text>
			</View>
			<View>
				<Checkbox
					value={toggleCheckBox}
					onValueChange={setHabitDone}
					color={theme.colors.primary}
				/>
			</View>
		</View>
	);
}
