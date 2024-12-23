import { useHabits } from "@context/HabitsContext";
import { FlatList, View } from "react-native";
import CategoryItem from "../Items/CategoryItem";
import { useSelect } from "@context/SelectContext";
import { useState, useEffect } from "react";

export enum CategoryType {
	positive = "positive",
	negative = "negative",
}

export enum CategoryTypeSelect {
	"positive" = "Positif",
	"negative" = "Négatif",
}

export default function CategoriesList() {
	const { categories, refreshCategories } = useHabits();
	const { type } = useSelect();
	const [hasRefreshed, setHasRefreshed] = useState(false);

	const positiveCategories = categories.filter(
		(category) => category.type === CategoryType.positive
	);

	const negativeCategories = categories.filter(
		(category) => category.type === CategoryType.negative
	);
	useEffect(() => {
		if (negativeCategories && !hasRefreshed) {
			console.log("refreshing categories");
			refreshCategories(true);
			setHasRefreshed(true);
		}
	}, [categories, hasRefreshed, refreshCategories]);

	if (!categories) {
		return null;
	}

	return (
		<View>
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