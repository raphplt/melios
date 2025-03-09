import { Text, View } from "react-native";
import HabitTypeItem from "../Items/HabitTypeItem";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { customMessage } from "@utils/select/customMessage";
import React from "react";
import { useTranslation } from "react-i18next";
import { HabitType } from "@utils/category.type";

export default function HabitsType() {
	const { theme } = useTheme();
	const { type, setType } = useSelect();
	const { t } = useTranslation();

	return (
		<>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-xl mt-1 w-[95%] mx-auto"
			>
				{t("create_habit")}
			</Text>
			<View className="flex flex-row items-center justify-evenly w-full mx-auto pt-4">
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="lucide:smile-plus"
							color={type === HabitType.positive ? "#fff" : theme.colors.text}
						/>
					}
					name={t("positive")}
					bgColorSelected={theme.colors.greenPrimary}
					onPress={() => setType(HabitType.positive)}
					typeHabit={HabitType.positive}
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="ant-design:stop-outlined"
							color={type === HabitType.negative ? "#fff" : theme.colors.text}
						/>
					}
					name={t("negative")}
					bgColorSelected={theme.colors.redPrimary}
					onPress={() => setType(HabitType.negative)}
					typeHabit={HabitType.negative}
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="mdi:repeat"
							color={type === HabitType.routine ? "#fff" : theme.colors.text}
						/>
					}
					name={t("routine")}
					bgColorSelected={theme.colors.bluePrimary}
					onPress={() => setType(HabitType.routine)}
					typeHabit={HabitType.routine}
				/>
			</View>
			<View
				className="w-[95%] mx-auto mt-4 px-4 py-2 rounded-xl flex flex-col"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-lg font-semibold"
				>
					{type}
				</Text>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-[14px]"
				>
					{customMessage(type)}
				</Text>
			</View>
		</>
	);
}
