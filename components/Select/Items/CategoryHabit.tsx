import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
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
	const { habits } = useData();

	const handlePress = () => {
		setHabit(item);
		navigation.navigate("customHabit");
	};

	const selectedHabit = habits.find((habit) => habit.habitId === item.id);

	return (
		<>
			<Pressable
				key={item.id}
				className="w-full flex flex-row items-center justify-between mx-auto py-4 px-4 rounded-2xl"
				onPress={handlePress}
				style={{
					backgroundColor: selectedHabit
						? theme.colors.background
						: theme.colors.cardBackground,
				}}
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
				{selectedHabit ? (
					<Iconify
						icon="material-symbols:check-circle"
						size={24}
						color={theme.colors.primary}
					/>
				) : (
					<Iconify
						icon="solar:round-arrow-right-bold"
						size={24}
						color={theme.colors.textTertiary}
					/>
				)}
			</Pressable>
			<View style={{ height: 1 }} className="w-11/12 mx-auto bg-gray-300" />
		</>
	);
}
