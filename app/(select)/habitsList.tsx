import CategoryHabit from "@components/Select/Items/CategoryHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { useHabits } from "@context/HabitsContext";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { Habit } from "@type/habit";
import { lightenColor } from "@utils/colors";
import { useEffect, useState } from "react";
import { View, Text, StatusBar, FlatList } from "react-native";

export default function CategoryList() {
	const { theme } = useTheme();
	const { category } = useSelect();
	const { habitsData, refreshHabits } = useHabits();
	const [hasRefreshed, setHasRefreshed] = useState(false);
	const [habits, setHabits] = useState<Habit[]>([]);

	useEffect(() => {
		if (!category || hasRefreshed) return;

		let filteredHabits = [];
		if (category.slug === "recommended") {
			filteredHabits = habitsData.filter((habit) => habit.recommended);
		} else {
			filteredHabits = habitsData.filter(
				(habit) => habit.category?.category === category.category
			);
		}

		setHabits(filteredHabits);

		if (filteredHabits.length === 0) {
			refreshHabits(true);
			setHasRefreshed(true);
		}
	}, [category, habitsData, refreshHabits, hasRefreshed]);

	if (!category) {
		return null; 
	}

	const lightColor = lightenColor(category.color, 0.2);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<View
				style={{
					backgroundColor: lightColor || theme.colors.cardBackground,
					paddingTop: 40,
				}}
				className="rounded-b-3xl"
			>
				<ButtonClose />
				<View className="w-11/12 flex flex-row items-center justify-start mx-auto py-4">
					<Text
						style={{
							color: category.color || theme.colors.text,
						}}
						className="text-3xl font-semibold mr-4"
					>
						{category.category}
					</Text>
					<FontAwesome6
						name={category.icon}
						size={40}
						color={category.color || theme.colors.text}
					/>
				</View>
			</View>

			<FlatList
				data={habits}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <CategoryHabit item={item} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}