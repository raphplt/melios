import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "./ThemContext";
import { getHabitById } from "../db/habits";
import tinycolor from "tinycolor2";

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
					<Text className=" text-lg italic font-semibold text-gray-900 right-2 top-0 absolute">
						{habitInfos.duration}''
					</Text>
				</View>
				<Text className="italic font-semibold text-gray-900 w-32 ml-2">
					{habitInfos.category}
				</Text>
			</View>
			<Text
				className=" text-lg italic font-semibold text-gray-900 text-center mt-2"
				style={{
					color: theme.colors.text,
				}}
			>
				{habitInfos.name}
			</Text>
		</View>
	) : null;
}
