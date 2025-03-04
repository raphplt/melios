import React, { useEffect, useState, useRef } from "react";
import { FlatList, View, Text } from "react-native";
import CategoryHabit from "@components/Select/Items/CategoryHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { useHabits } from "@context/HabitsContext";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";

const ITEM_HEIGHT = 60;

export default function CategoryList() {
	const { theme } = useTheme();
	const { category } = useSelect();
	const { habitsData, refreshHabits } = useHabits();
	const [hasRefreshed, setHasRefreshed] = useState(false);
	const [habits, setHabits] = useState<Habit[]>([]);
	const flatListRef = useRef<FlatList>(null);

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
		<View style={{ flex: 1, backgroundColor: theme.colors.cardBackground }}>
			<View
				style={{
					backgroundColor: lightColor || theme.colors.cardBackground,
					paddingTop: 40,
					borderBottomLeftRadius: 30,
					borderBottomRightRadius: 30,
				}}
			>
				<ButtonClose />
				<View
					style={{
						width: "90%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						alignSelf: "center",
						paddingVertical: 16,
					}}
				>
					<Text
						style={{
							color: category.color || theme.colors.text,
							fontSize: 24,
							fontWeight: "bold",
							marginRight: 16,
						}}
					>
						{category.category}
					</Text>
					<FontAwesome6
						name={category.icon}
						size={32}
						color={category.color || theme.colors.text}
					/>
				</View>
			</View>

			<FlatList
				ref={flatListRef}
				data={habits}
				keyExtractor={(item) => item.id.toString()}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={<View style={{ height: 20 }} />}
				renderItem={({ item }) => (
					<View
						style={{
							height: ITEM_HEIGHT,
							justifyContent: "center",
						}}
					>
						<CategoryHabit item={item} />
					</View>
				)}
			/>
		</View>
	);
}