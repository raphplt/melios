import { useTheme } from "@context/ThemeContext";
import { CategoryTypeSelect } from "@utils/category.type";
import { t } from "i18next";
import React from "react";
import { View, Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

type Props = {
	filter: CategoryTypeSelect;
	setFilter: (filter: CategoryTypeSelect) => void;
};

const FiltersHabits = ({ filter, setFilter }: Props) => {
	const { theme } = useTheme();
	return (
		<View className="flex flex-row items-center justify-center pt-4">
			<Pressable
				onPress={() => setFilter(CategoryTypeSelect.positive)}
				style={{
					backgroundColor:
						filter === CategoryTypeSelect.positive
							? theme.colors.backgroundTertiary
							: theme.colors.cardBackground,
				}}
				className="mx-2 px-3 py-2 rounded-2xl flex flex-row items-center"
			>
				<Iconify icon="lucide:smile-plus" size={20} color={theme.colors.primary} />
				<Text
					style={{
						color:
							filter === CategoryTypeSelect.positive
								? theme.colors.primary
								: theme.colors.text,
						fontWeight: filter === CategoryTypeSelect.positive ? "bold" : "normal",
					}}
					className="text-[13px] mx-2"
				>
					{t("positive_habits")}
				</Text>
			</Pressable>

			<Pressable
				onPress={() => setFilter(CategoryTypeSelect.negative)}
				style={{
					backgroundColor:
						filter === CategoryTypeSelect.negative
							? theme.colors.redSecondary
							: theme.colors.cardBackground,
				}}
				className="mx-2 px-3 py-2 rounded-2xl flex flex-row items-center"
			>
				<Iconify icon="ic:round-back-hand" size={20} color={theme.colors.text} />
				<Text
					style={{
						color:
							filter === CategoryTypeSelect.negative
								? theme.colors.text
								: theme.colors.text,
						fontWeight: filter === CategoryTypeSelect.negative ? "bold" : "normal",
					}}
					className="text-[13px] mx-2"
				>
					{t("negative_habits")}
				</Text>
			</Pressable>
		</View>
	);
};

export default FiltersHabits;
