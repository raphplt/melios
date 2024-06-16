import React, { useContext, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	TextInput,
	Animated,
	FlatList,
	ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { ThemeContext } from "../components/ThemeContext";
import { getHabitsWithCategories } from "../db/fetch";
import CardHabit from "../components/habits/CardHabit";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ButtonViewMore from "../components/ButtonViewMore";

export default function Select() {
	const [habitsData, setHabitsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [deleteAdvice, setDeleteAdvice] = useState(false);
	const [displayedHabitsCount, setDisplayedHabitsCount]: any = useState({});
	const [selectedCategory, setSelectedCategory] = useState(null);
	

	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const translateY = useRef(new Animated.Value(0)).current;
	const scrollViewRef: any = useRef(null);

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getHabitsWithCategories();
				setHabitsData(data);
				setLoading(false);
				const initialDisplayedCounts = data.reduce((acc: any, habit: any) => {
					const category = habit.category?.category || "Autres";
					acc[category] = 5;
					return acc;
				}, {});
				setDisplayedHabitsCount(initialDisplayedCounts);
			} catch (error) {
				console.log(
					"Select - Erreur lors de la récupération des habitudes : ",
					error
				);
			}
		};

		fetchHabitsData();
	}, []);

	const filteredHabitsData = habitsData.filter((habit: any) => {
		const categoryMatch = selectedCategory
			? habit.category?.category === selectedCategory
			: true;
		const searchMatch = habit.name
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.includes(
				search
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
			);
		return categoryMatch && searchMatch;
	});

	const groupedHabits = filteredHabitsData.reduce((acc: any, habit: any) => {
		const category = habit.category?.category || "Autres";
		if (!acc[category]) {
			acc[category] = {
				color: habit.category?.color || "#000000",
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

	const renderHabit = ({ item }: any) => (
		<CardHabit habit={item} navigation={navigation} />
	);

	const renderCategory = ({ item }: any) => (
		<View key={item.category} className="mt-3">
			<Pressable
				className="w-11/12 mx-auto flex flex-row items-center justify-between py-1 px-2 rounded-lg mb-2 mt-4 drop-shadow-lg"
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
					item.habits.length > displayedHabitsCount[item.category] ? (
						<ButtonViewMore
							text="Voir plus"
							onPress={() =>
								setDisplayedHabitsCount((prevState: any) => ({
									...prevState,
									[item.category]: prevState[item.category] + 10,
								}))
							}
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
			{loading ? (
				<View
					className="flex items-center justify-center h-screen"
					style={{ backgroundColor: theme.colors.background }}
				>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			) : (
				<FlatList
					style={{ backgroundColor: theme.colors.background }}
					data={categories}
					renderItem={renderCategory}
					keyExtractor={(item) => item.category}
					ListHeaderComponent={
						<>
							{!deleteAdvice && (
								<View
									className="flex flex-row items-center w-11/12 mx-auto rounded-xl py-2 px-3 mt-4"
									style={{
										backgroundColor: "#FFC67C",
										borderColor: theme.colors.border,
										borderWidth: 1,
									}}
								>
									<Ionicons name="bulb" size={24} style={{ color: theme.colors.text }} />
									<Text
										className="text-[15px] w-10/12 mx-auto text-left font-semibold"
										style={{ color: theme.colors.text }}
									>
										Vous pouvez sélectionner jusqu'à 20 habitudes.
									</Text>
									<Pressable
										onPress={() => setDeleteAdvice(true)}
										style={{ position: "absolute", right: 10 }}
									>
										<Ionicons
											name="close"
											size={24}
											style={{ color: theme.colors.text }}
										/>
									</Pressable>
								</View>
							)}
							<View
								className="flex flex-row items-center w-11/12 mx-auto rounded-xl py-1 px-3 mt-4"
								style={{
									backgroundColor: theme.colors.cardBackground,
									borderColor: theme.colors.border,
									borderWidth: 1,
								}}
							>
								<Ionicons
									name="search"
									size={24}
									style={{ color: theme.colors.text, marginRight: 10 }}
								/>
								<TextInput
									style={{ flex: 1, height: 40, color: theme.colors.text }}
									onChangeText={(text) => setSearch(text)}
									value={search}
									placeholder="Rechercher une habitude"
								/>
								{search.length > 0 && (
									<Pressable onPress={() => setSearch("")}>
										<Ionicons
											name="close-circle"
											size={24}
											style={{ color: theme.colors.text }}
										/>
									</Pressable>
								)}
							</View>
							<ScrollView
								ref={scrollViewRef}
								horizontal
								showsHorizontalScrollIndicator={false}
								className="mt-3 ml-4"
							>
								{categories.map((category) => (
									<Pressable
										key={category.category}
										className="flex py-2 px-4 rounded-xl mx-1"
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
			)}
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
