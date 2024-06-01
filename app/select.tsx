import { useNavigation } from "expo-router";
import { useContext, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	Pressable,
	ActivityIndicator,
	TextInput,
	Animated,
} from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { getAllHabits } from "../db/habits";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../components/habits/CardHabit";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";

const groupHabitsByCategory = (habits: any) => {
	return habits.reduce((acc: any, habit: any) => {
		const category = habit.category;
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(habit);
		return acc;
	}, {});
};

export default function Select() {
	const [habitsData, setHabitsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const translateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getAllHabits();
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

	const filteredHabits = habitsData.filter((habit: any) =>
		habit.name.toLowerCase().includes(search.toLowerCase())
	);
	const groupedHabits = groupHabitsByCategory(filteredHabits);

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
			<ScrollView style={{ backgroundColor: theme.colors.background }}>
				<View
					className="flex flex-row items-center w-11/12 mx-auto rounded-xl py-2 px-3 mt-4"
					style={{
						backgroundColor: "#3B82F6",
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<Ionicons name="bulb" size={24} color="white" />
					<Text className="text-[15px] w-10/12  mx-auto text-left text-white">
						Vous pouvez sélectionner jusqu'à 20 habitudes.
					</Text>
				</View>
				<View className="flex flex-row items-center w-full mx-auto rounded-xl py-1 px-3 mt-4">
					<TextInput
						style={{
							height: 40,
							borderColor: "gray",
							borderWidth: 1,
							color: theme.colors.text,
							backgroundColor: theme.colors.cardBackground,
						}}
						onChangeText={(text) => setSearch(text)}
						value={search}
						className="w-11/12 mx-auto pl-3 rounded-xl"
						placeholder="Rechercher une habitude"
					/>
				</View>
				<View
					className="flex flex-col mt-2"
					style={{ backgroundColor: theme.colors.background }}
				>
					{Object.keys(groupedHabits).map((category) => (
						<View key={category} className="mt-3">
							<Text
								className="text-lg font-bold mb-1 w-10/12 mx-auto"
								style={{ color: theme.colors.text }}
							>
								{category}
							</Text>
							{groupedHabits[category].map((habit: any, index: any) => (
								<CardHabit key={index} habit={habit} navigation={navigation} />
							))}
						</View>
					))}
				</View>
				<View />
			</ScrollView>
			<Pressable
				className="w-10/12 mx-auto mt-6 fixed bottom-3"
				style={{
					backgroundColor: theme.colors.primary,
					paddingVertical: 10,
					borderRadius: 10,
				}}
				onPress={handleNavigation}
			>
				<View className="flex items-center justify-center flex-row gap-2">
					<View>
						<AntDesign name="checkcircleo" size={20} color="white" />
					</View>
					<Text className="text-center text-lg text-white ">Valider</Text>
				</View>
			</Pressable>
		</Animated.View>
	);
}
