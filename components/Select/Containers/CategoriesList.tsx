import { useHabits } from "@context/HabitsContext";
import { FlatList } from "react-native";
import CategoryItem from "../Items/CategoryItem";

export default function CategoriesList() {
	const { categories } = useHabits();

	return (
		<FlatList
			data={categories}
			renderItem={({ item }) => <CategoryItem category={item} />}
			keyExtractor={(item) => item.id}
			numColumns={2}
		/>
	);
}
