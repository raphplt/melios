import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import tinycolor from "tinycolor2";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { UserHabit } from "../../types/userHabit";
import { ThemeContext } from "@context/ThemeContext";
import { getHabitById } from "@db/habits";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

export default function Activity({ userHabit }: { userHabit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<any>({});

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(userHabit.id);
			setHabitInfos(result);
		}
		getHabitInfos();
	}, []);

	const lighterColor = tinycolor(habitInfos.category?.color)
		.lighten(30)
		.toString();

	return lighterColor ? (
		<View
			className="h-64 w-40 mx-2 rounded-2xl"
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<Pressable
				onPress={() => {
					navigation.navigate("habitDetail", {
						habit: JSON.stringify(userHabit),
						habitInfos: JSON.stringify(habitInfos),
					});
				}}
			>
				<View
					style={{
						backgroundColor: lighterColor,
					}}
					className="h-14 rounded-t-xl"
				>
					<View>
						<Text
							className=" text-[16px] italic font-semibold text-gray-900 right-2 top-2 absolute rounded-2xl px-2 border-[1px]"
							style={{
								color: theme.colors.textSecondary,
								backgroundColor: theme.colors.text,
								borderColor: theme.colors.border,
							}}
						>
							{habitInfos.duration}''
						</Text>
					</View>
					<Text className="italic font-semibold text-gray-900 w-1/2 ml-3 mt-2">
						{habitInfos.category?.category}
					</Text>
				</View>
				<View className="flex flex-col justify-around items-center mt-2 h-2/3">
					<Text
						className="text-md w-10/12 mx-auto font-semibold text-gray-900 text-center"
						style={{
							color: theme.colors.text,
						}}
					>
						{habitInfos.name}
					</Text>
					<FontAwesome6
						name={habitInfos.category?.icon || "question"}
						size={32}
						color={habitInfos.category?.color || theme.colors.text}
						style={{ marginRight: 10 }}
					/>
				</View>
			</Pressable>
		</View>
	) : null;
}
