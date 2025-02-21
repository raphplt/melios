import React, { useEffect, useState, useRef } from "react";
import { Animated, Dimensions, View, Text } from "react-native";
import CategoryHabit from "@components/Select/Items/CategoryHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { useHabits } from "@context/HabitsContext";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";

const { height: screenHeight } = Dimensions.get("screen");
const ITEM_HEIGHT = 80;

export default function CategoryList() {
	const { theme } = useTheme();
	const { category } = useSelect();
	const { habitsData, refreshHabits } = useHabits();
	const [hasRefreshed, setHasRefreshed] = useState(false);
	const [habits, setHabits] = useState([]);
	const scrollY = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<Animated.FlatList>(null);

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
						size={40}
						color={category.color || theme.colors.text}
					/>
				</View>
			</View>

			<Animated.FlatList
				ref={flatListRef}
				data={habits}
				keyExtractor={(item) => item.id.toString()}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				decelerationRate="fast"
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				// Suppression du padding top inutile
				contentContainerStyle={{
					paddingBottom: (screenHeight - ITEM_HEIGHT) / 2,
				}}
				// Ajout d’un header léger au lieu d’un padding excessif
				ListHeaderComponent={<View style={{ height: 20 }} />}
				renderItem={({ item, index }) => {
					const inputRange = [
						(index - 1) * ITEM_HEIGHT,
						index * ITEM_HEIGHT,
						(index + 1) * ITEM_HEIGHT,
					];
					const scale = scrollY.interpolate({
						inputRange,
						outputRange: [0.9, 1, 0.9],
						extrapolate: "clamp",
					});
					const opacity = scrollY.interpolate({
						inputRange,
						outputRange: [0.5, 1, 0.5],
						extrapolate: "clamp",
					});

					return (
						<Animated.View
							style={{
								transform: [{ scale }],
								opacity,
								height: ITEM_HEIGHT,
								justifyContent: "center",
							}}
						>
							<CategoryHabit item={item} />
						</Animated.View>
					);
				}}
			/>
		</View>
	);
}
