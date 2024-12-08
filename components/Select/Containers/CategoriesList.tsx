import { useHabits } from "@context/HabitsContext";
import { FlatList, View, Image, Dimensions, Text } from "react-native";
import CategoryItem from "../Items/CategoryItem";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";

export default function CategoriesList() {
	const { categories } = useHabits();
	const { type } = useSelect();
	const { theme } = useTheme();

	const { width } = Dimensions.get("window");

	const positiveCategories = categories.filter(
		(category) => category.type === "positive"
	);

	return (
		<View>
			{type === "Positif" ? (
				<FlatList
					data={positiveCategories}
					renderItem={({ item }) => <CategoryItem category={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2}
					className="w-[95%] mx-auto pb-4"
				/>
			) : (
				<View
					className="flex flex-col items-center justify-center py-12"
					style={{
						backgroundColor: theme.colors.background,
					}}
				>
					<CachedImage
						imagePath="images/illustrations/character3.png"
						style={{
							width: width * 0.4,
							height: width * 0.4,
							marginVertical: 16,
							resizeMode: "contain",
						}}
					/>
					<Text
						className="text-center mt-4 text-[16px] w-11/12 mx-auto"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						Les habitudes négatives arrivent bientôt !
					</Text>
				</View>
			)}
		</View>
	);
}