import { useHabits } from "@context/HabitsContext";
import { FlatList, View } from "react-native";
import CategoryItem from "../Items/CategoryItem";
import { useSelect } from "@context/SelectContext";
import { useState, useEffect } from "react";
import { CategoryType, CategoryTypeSelect } from "@utils/category.type";
import { useTheme } from "@context/ThemeContext";

export default function CategoriesList() {
	const { categories, refreshCategories } = useHabits();
	const { type } = useSelect();
	const [hasRefreshed, setHasRefreshed] = useState(false);
	const { theme } = useTheme();

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
			) : (
				type === CategoryTypeSelect.negative && (
					<FlatList
						data={negativeCategories}
						renderItem={({ item }) => <CategoryItem category={item} />}
						keyExtractor={(item) => item.id}
						numColumns={2}
						className="w-[95%] mx-auto pb-4"
					/>
				)
			)}
		</View>
	);
}