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
	const [deleteAdvice, setDeleteAdvice] = useState(false);

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
			<ScrollView
				style={{ backgroundColor: theme.colors.background }}
				className="h-screen"
			>
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
							className="text-[15px] w-10/12  mx-auto text-left font-semibold "
							style={{ color: theme.colors.text }}
						>
							Vous pouvez sélectionner jusqu'à 20 habitudes.
						</Text>
						<Pressable
							onPress={() => setDeleteAdvice(true)}
							style={{ position: "absolute", right: 10 }}
						>
							<Ionicons name="close" size={24} style={{ color: theme.colors.text }} />
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
						style={{
							flex: 1,
							height: 40,
							color: theme.colors.text,
						}}
						onChangeText={(text) => setSearch(text)}
						value={search}
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
			<View
				className="w-full h-fit mx-auto fixed bottom-0 py-2 pt-4"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
					}}
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
