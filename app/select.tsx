// Select.tsx
import React, { useContext, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	Animated,
	FlatList,
	ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import { useHabits } from "../context/HabitsContext"; // Import the context
import CardHabit from "../components/Habits/CardHabit";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import NumberSelected from "../components/Select/NumberSelected";
import { Habit } from "../types/habit";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonViewMore from "@components/Home/ButtonViewMore";
import SearchBar from "@components/Select/SearchBar";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { normalizeAndLowerCase } from "@utils/habitsUtils";

export default function Select() {
	const { habitsData, loading } = useHabits();
	const [search, setSearch] = useState("");
	const [displayedHabitsCount, setDisplayedHabitsCount]: any = useState({});
	const [selectedCategory, setSelectedCategory] = useState(null);
	const { habits } = useData();
	const [loaderFilter, setLoaderFilter] = useState(false);

	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const translateY = useRef(new Animated.Value(0)).current;
	const scrollViewRef: any = useRef(null);

	useEffect(() => {
		if (!loading) {
			setLoaderFilter(true);
			const initialDisplayedCounts = habitsData.reduce(
				(acc: any, habit: Habit) => {
					const category = habit.category?.category || "Autres";
					acc[category] = 5;
					return acc;
				},
				{}
			);
			setDisplayedHabitsCount(initialDisplayedCounts);
			setLoaderFilter(false);
		}
	}, [loading, habitsData]);

	const filteredHabitsData = habitsData.filter((habit: Habit) => {
		const categoryMatch = selectedCategory
			? habit.category?.category === selectedCategory
			: true;
		const searchMatch = normalizeAndLowerCase(habit.name).includes(
			normalizeAndLowerCase(search)
		);
		return categoryMatch && searchMatch;
	});

	const groupedHabits = filteredHabitsData.reduce((acc: any, habit: Habit) => {
		const category = habit.category?.category || "Autres";
		if (!acc[category]) {
			acc[category] = {
				color: habit.category?.color || theme.colors.text,
				icon: habit.category?.icon || "question",
				habits: [],
			};
		}
		acc[category].habits.push(habit);
		return acc;
	}, {});

	const categories = Object.keys(groupedHabits).map((category) => ({
		category,
		...groupedHabits[category],
	}));

	const handleNavigation = () => {
		Animated.spring(translateY, {
			toValue: -1000,
			useNativeDriver: true,
		}).start(() => {
			navigation.navigate("(navbar)");
		});
	};

	if (loading || loaderFilter)
		return <LoaderScreen text="Chargement des habitudes..." />;

	const renderHabit = ({ item }: { item: Habit }) => <CardHabit habit={item} />;

	console.log("loading", loading);

	const renderCategory = ({ item }: any) => (
		<View key={item.category} className="mt-3">
			<Pressable
				className="w-11/12 mx-auto flex flex-row items-center justify-between py-1 px-2 rounded-3xl mb-2 mt-4 drop-shadow-lg"
				style={{
					backgroundColor: theme.colors.cardBackground,
					borderColor: item.color,
					borderWidth: 1,
				}}
				onPress={() =>
					setDisplayedHabitsCount((prevState: any) => ({
						...prevState,
						[item.category]: prevState[item.category] > 0 ? 0 : 5,
					}))
				}
			>
				<View
					className="flex flex-row items-center"
					style={{ backgroundColor: theme.colors.cardBackground }}
				>
					<FontAwesome6
						name={item.icon}
						size={20}
						color={item.color}
						style={{ marginRight: 5, marginLeft: 5 }}
					/>
					<Text
						className="text-lg font-semibold px-1 italic"
						style={{ color: item.color }}
					>
						{item.category}
					</Text>
				</View>
				<View>
					{displayedHabitsCount[item.category] === 5 ? (
						<AntDesign name="caretup" size={24} color={item.color} />
					) : (
						<AntDesign name="caretdown" size={24} color={item.color} />
					)}
				</View>
			</Pressable>
			<FlatList
				data={item.habits.slice(0, displayedHabitsCount[item.category])}
				renderItem={renderHabit}
				keyExtractor={(habit) => habit.id}
				nestedScrollEnabled
				ListFooterComponent={
					displayedHabitsCount[item.category] > 0 &&
					item.habits.length > displayedHabitsCount[item.category] ? (
						<ButtonViewMore
							text={null}
							onPress={() =>
								setDisplayedHabitsCount((prevState: any) => ({
									...prevState,
									[item.category]: prevState[item.category] + 10,
								}))
							}
							listLength={item.habits.length}
							maxLength={displayedHabitsCount[item.category]}
						/>
					) : null
				}
			/>
		</View>
	);

	const handleCategoryPress = (category: any) => {
		setSelectedCategory(category === selectedCategory ? null : category);
		setTimeout(() => {
			scrollViewRef.current?.scrollTo({
				x: 0,
				animated: true,
			});
		}, 100);
	};

	return (
		<Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
			<FlatList
				style={{ backgroundColor: theme.colors.background }}
				data={categories}
				renderItem={renderCategory}
				keyExtractor={(item) => item.category}
				ListHeaderComponent={
					<>
						<View className="flex flex-row mx-auto">
							<SearchBar search={search} setSearch={setSearch} theme={theme} />
							<NumberSelected number={habits.length} />
						</View>
						<ScrollView
							ref={scrollViewRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							className="pt-4 ml-4"
						>
							{categories.map((category) => (
								<Pressable
									key={category.category}
									className="flex py-2 px-4 rounded-3xl mx-1"
									style={{
										backgroundColor:
											selectedCategory === category.category
												? theme.colors.primary
												: category.color || "black",
									}}
									onPress={() => handleCategoryPress(category.category)}
								>
									<Text className="text-white">{category.category}</Text>
								</Pressable>
							))}
						</ScrollView>
					</>
				}
			/>
			<View
				className="w-full h-fit mx-auto fixed bottom-0 py-2 pt-4"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Pressable
					style={{ backgroundColor: theme.colors.primary }}
					onPress={handleNavigation}
					className="flex flex-row gap-x-2 items-center justify-center w-10/12 mx-auto rounded-xl py-2"
				>
					<View>
						<AntDesign name="checkcircleo" size={20} color="white" />
					</View>
					<Text className="text-center text-lg text-white">Valider</Text>
				</Pressable>
			</View>
		</Animated.View>
	);
}
