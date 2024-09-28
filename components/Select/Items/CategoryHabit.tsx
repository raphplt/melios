import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Habit } from "@type/habit";
import { useNavigation } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function CategoryHabit({ item }: { item: Habit }) {
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { theme } = useTheme();
	const { setHabit } = useSelect();

	const handlePress = () => {
		setHabit(item);
		navigation.navigate("customHabit");
	};

	return (
		<Pressable
			key={item.id}
			className="w-full flex flex-row items-center justify-between mx-auto py-4 px-4"
			onPress={handlePress}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="font-bold text-lg w-10/12"
				numberOfLines={1}
				ellipsizeMode="tail"
			>
				{item.name}
			</Text>
			<Iconify
				icon="fluent:arrow-right-12-regular"
				size={20}
				color={theme.colors.textTertiary}
			/>
		</Pressable>
	);
}
