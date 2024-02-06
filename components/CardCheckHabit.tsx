import { useContext, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import Checkbox from "expo-checkbox";
import { setMemberHabitLog } from "../db/member";
import moment from "moment";
import { getHabitById } from "../db/habits";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CardCheckHabit({ habit, onHabitStatusChange }: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitInfos, setHabitInfos] = useState<any>({});
	const colorDifficulties: any = {
		1: "#FFEE59",
		2: "#FF7A00",
		3: "#FA6F6F",
	};

	const navigation: any = useNavigation();

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
			console.log(result);
		}
		getHabitInfos();
	}, []);

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
			<Pressable
				onPress={() =>
					navigation.navigate("habitDetail", {
						habit: habit,
						habitInfos: habitInfos,
					})
				}
			>
				<View
					className="flex flex-row justify-around py-2 rounded-xl basis-4/5  border-[1px]"
					style={{
						borderColor: theme.colors.primary,
						backgroundColor: theme.colors.background,
					}}
				>
					<Text
						style={{ color: theme.colors.text }}
						className="ml-2 text-[16px] line-clamp-2 w-3/4"
					>
						{habit.name}
					</Text>
					<Ionicons
						name="flame"
						size={24}
						color={colorDifficulties[habitInfos.difficulty]}
					/>
				</View>
			</Pressable>
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
