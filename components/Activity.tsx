import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import { getHabitById } from "../db/habits";
import tinycolor from "tinycolor2";
import { FontAwesome } from "@expo/vector-icons";

export default function Activity({ habit }: any) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<any>({});

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
		}
		getHabitInfos();
	}, []);

	const lighterColor = tinycolor(habitInfos.color).lighten(30).toString();

	return lighterColor ? (
		<View
			style={{
				backgroundColor: theme.colors.backgroundSecondary,
			}}
			className="h-64 w-40 mx-1 rounded-xl"
		>
			<View
				style={{
					backgroundColor: lighterColor,
				}}
				className="h-14 rounded-t-xl"
			>
				<View>
					<Text className=" text-lg italic font-semibold text-gray-900 right-2 top-2 absolute">
						{habitInfos.duration}''
					</Text>
				</View>
				<Text className="italic font-semibold text-gray-900 w-32 ml-3 mt-3">
					{habitInfos.category}
				</Text>
			</View>
			<View className="flex flex-col justify-around items-center mt-2 h-2/3">
				<Text
					className="text-lg w-10/12 mx-auto font-semibold text-gray-900 text-center"
					style={{
						color: theme.colors.text,
					}}
				>
					{habitInfos.name}
				</Text>
				<FontAwesome
					name="arrow-circle-right"
					size={24}
					color={theme.colors.text}
				/>
			</View>
		</View>
	) : null;
}
