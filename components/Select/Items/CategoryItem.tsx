import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Category } from "@type/category";
import { lightenColor } from "@utils/colors";
import { useNavigation } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function CategoryItem({ category }: { category: Category }) {
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { theme } = useTheme();
	const { setCategory } = useSelect();

	const lightColor = lightenColor(category.color, 0.2);

	const handlePress = () => {
		setCategory(category);
		navigation.navigate("categoryList");
	};

	return (
		<Pressable
			onPress={handlePress}
			style={{ backgroundColor: lightColor || theme.colors.cardBackground }}
			className="w-[46%] rounded-lg flex flex-row items-center justify-between py-6 px-2 my-2 mx-auto"
		>
			<Text style={{ color: theme.colors.text }} className=" font-bold">
				{category.category}
			</Text>
			<FontAwesome6
				name={category.icon}
				size={20}
				color={category.color || theme.colors.text}
			/>
		</Pressable>
	);
}
