import React, { useContext, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	Pressable,
	ActivityIndicator,
	TextInput,
	Animated,
	FlatList,
} from "react-native";
import { useNavigation } from "expo-router";
import { ThemeContext } from "../components/ThemeContext";
import { getHabitsWithCategories } from "../db/fetch";
import CardHabit from "../components/habits/CardHabit";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Select() {
	const [habitsData, setHabitsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [deleteAdvice, setDeleteAdvice] = useState(false);

	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const translateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getHabitsWithCategories();
				setHabitsData(data);
				setLoading(false);
			} catch (error) {
				console.log(
					"Select - Erreur lors de la récupération des habitudes : ",
					error
				);
			}
		};

		fetchHabitsData();
	}, []);

	const groupedHabits = habitsData.reduce((acc: any, habit: any) => {
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
		Animated.timing(translateY, {
			toValue: -1000,
			duration: 400,
			easing: Easing.linear,
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
			<View
				className="w-[90%] mx-auto"
				style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
			>
				<FontAwesome6
					name={item.icon}
					size={24}
					color={item.color}
					style={{ marginRight: 10 }}
				/>
				<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
					{item.category}
				</Text>
			</View>
			<FlatList
				data={item.habits}
				renderItem={renderHabit}
				keyExtractor={(habit) => habit.id}
				nestedScrollEnabled
			/>
		</View>
	);

	return (
		<Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
			{loading && (
				<View
					className="flex items-center justify-center h-screen"
					style={{ backgroundColor: theme.colors.background }}
				>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			)}
			{!loading && (
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
										className="text-[15px] w-10/12 mx-auto text-left font-semibold "
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
							</View>
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
					<Text className="text-center text-lg text-white ">Valider</Text>
				</Pressable>
			</View>
		</Animated.View>
	);
}
