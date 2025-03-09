import { useTheme } from "@context/ThemeContext";
import { HabitType } from "@utils/category.type";
import { t } from "i18next";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AddHabits from "./AddHabits";

type Props = {
	filter: HabitType;
	setFilter: (filter: HabitType) => void;
};

const FiltersHabits = ({ filter, setFilter }: Props) => {
	const { theme } = useTheme();
	return (
		<View className="flex flex-row items-center justify-center pt-3">
			<View className="flex flex-row items-center gap-x-1 mr-4">
				<TouchableOpacity
					onPress={() => setFilter(HabitType.positive)}
					style={{
						borderColor:
							filter === HabitType.positive
								? theme.colors.primary
								: theme.colors.border,
						borderWidth: 2,
					}}
					className="mx-1 px-2 py-[10px] rounded-3xl flex flex-row items-center"
				>
					<Text
						style={{
							color:
								filter === HabitType.positive
									? theme.colors.primary
									: theme.colors.textTertiary,
						}}
						className="text-[13px] mx-2 font-semibold"
					>
						{t("positive_habits")}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setFilter(HabitType.negative)}
					style={{
						borderColor:
							filter === HabitType.negative
								? theme.colors.redPrimary
								: theme.colors.border,
						borderWidth: 2,
					}}
					className="mx-1 px-2 py-[10px] rounded-3xl flex flex-row items-center "
				>
					<Text
						style={{
							color:
								filter === HabitType.negative
									? theme.colors.redPrimary
									: theme.colors.textTertiary,
						}}
						className="text-[13px] mx-2 font-semibold"
					>
						{t("negative_habits")}
					</Text>
				</TouchableOpacity>
			</View>

			<AddHabits />
		</View>
	);
};

export default FiltersHabits;
