import { useTheme } from "@context/ThemeContext";
import { CategoryTypeSelect } from "@utils/category.type";
import { t } from "i18next";
import React from "react";
import { View, Pressable, Text, TouchableOpacity } from "react-native";
import { Iconify } from "react-native-iconify";

type Props = {
	filter: CategoryTypeSelect;
	setFilter: (filter: CategoryTypeSelect) => void;
};

const FiltersHabits = ({ filter, setFilter }: Props) => {
	const { theme } = useTheme();
	return (
		<View className="flex flex-row items-center justify-center pt-4">
			<TouchableOpacity
				onPress={() => setFilter(CategoryTypeSelect.positive)}
				style={{
					borderColor:
						filter === CategoryTypeSelect.positive
							? theme.colors.primary
							: theme.colors.border,
					borderWidth: 2,
				}}
				className="mx-2 px-3 py-[6px] rounded-3xl flex flex-row items-center"
			>
				<Iconify
					icon="lucide:smile-plus"
					size={16}
					color={
						filter === CategoryTypeSelect.positive
							? theme.colors.primary
							: theme.colors.grayPrimary
					}
				/>
				<Text
					style={{
						color:
							filter === CategoryTypeSelect.positive
								? theme.colors.primary
								: theme.colors.text,
					}}
					className="text-[13px] mx-2"
				>
					{t("positive_habits")}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => setFilter(CategoryTypeSelect.negative)}
				style={{
					borderColor:
						filter === CategoryTypeSelect.negative
							? theme.colors.redPrimary
							: theme.colors.border,
					borderWidth: 2,
				}}
				className="mx-2 px-3 py-[6px] rounded-3xl flex flex-row items-center"
			>
				<Iconify
					icon="ic:round-back-hand"
					size={16}
					color={
						filter === CategoryTypeSelect.negative
							? theme.colors.redPrimary
							: theme.colors.grayPrimary
					}
				/>
				<Text
					style={{
						color:
							filter === CategoryTypeSelect.negative
								? theme.colors.redPrimary
								: theme.colors.text,
					}}
					className="text-[13px] mx-2"
				>
					{t("negative_habits")}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FiltersHabits;
