import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import { View, Text, FlatList } from "react-native";
import CategoryItem from "../Items/CategoryItem";

export default function CategoriesList() {
	const { theme } = useTheme();
	const { categories } = useHabits();

	return (
		<View>
			{/* Categories */}
			<View>
				<FlatList
					data={categories}
					renderItem={({ item }) => <CategoryItem category={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2}
				/>
			</View>
		</View>
	);
}
