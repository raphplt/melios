import { useHabits } from "@context/HabitsContext";
import { FlatList, View, Text, Pressable } from "react-native";
import CategoryItem from "../Items/CategoryItem";
import { useSelect } from "@context/SelectContext";
import { useState, useEffect } from "react";
import { CategoryType, CategoryTypeSelect } from "@utils/category.type";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Iconify } from "react-native-iconify";

export default function CategoriesList() {
	const { categories, refreshCategories } = useHabits();
	const { type } = useSelect();
	const [hasRefreshed, setHasRefreshed] = useState(false);
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { t } = useTranslation();

	const positiveCategories = categories
		.filter((category) => category.type === CategoryType.positive)
		.sort((a: any, b: any) => a.id - b.id);

	const negativeCategories = categories
		.filter((category) => category.type === CategoryType.negative)
		.sort((a: any, b: any) => a.id - b.id);

	useEffect(() => {
		const missingIcon = categories.some((category) => !category.icon);
		if (
			(!negativeCategories || !positiveCategories || missingIcon) &&
			!hasRefreshed
		) {
			refreshCategories(true);
			setHasRefreshed(true);
		}
	}, [categories, hasRefreshed, refreshCategories]);

	if (!categories) {
		return null;
	}

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			{type === CategoryTypeSelect.positive ? (
				<FlatList
					data={positiveCategories}
					renderItem={({ item }) => <CategoryItem category={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2}
					className="w-[95%] mx-auto pb-4"
				/>
			) : type === CategoryTypeSelect.negative ? (
				<FlatList
					data={negativeCategories}
					renderItem={({ item }) => <CategoryItem category={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2}
					className="w-full mx-auto pb-4"
				/>
			) : type === CategoryTypeSelect.routine ? (
				<View className="flex items-center justify-start h-full mt-16">
					<View className="flex flex-col gap-2 items-center py-2">
						<Iconify size={40} icon="mdi:idea" color={theme.colors.primary} />
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold"
						>
							{t("create_routine_description")}
						</Text>
					</View>
					<View className="flex flex-col gap-2 items-center py-2">
						<Iconify
							size={40}
							icon="mdi:calendar-clock"
							color={theme.colors.primary}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold"
						>
							{t("create_routine_time")}
						</Text>
					</View>

					<Pressable
						onPress={() => {
							navigation.navigate("customRoutine");
						}}
						style={{
							backgroundColor: theme.colors.primary,
						}}
						className="rounded-xl flex items-center gap-2 mt-10 flex-row justify-center my-2 p-4 w-11/12 mx-auto"
					>
						<Text
							style={{
								color: theme.colors.textSecondary,
							}}
							className="text-[16px] font-semibold"
						>
							{t("create_routine")}
						</Text>
						<Iconify size={20} icon="mdi:arrow-right" color="#fff" />
					</Pressable>
				</View>
			) : null}
		</View>
	);
}