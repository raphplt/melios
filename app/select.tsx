import { useNavigation } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { getAllHabits } from "../db/habits";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../components/CardHabit";
import { Ionicons } from "@expo/vector-icons";

export default function Select() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	const [habitsData, setHabitsData]: any = useState([]);

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getAllHabits();
				setHabitsData(data);
			} catch (error) {
				console.log(
					"Select - Erreur lors de la récupération des habitudes : ",
					error
				);
			}
		};

		fetchHabitsData();
	}, []);

	return (
		<ThemeProvider value={theme}>
			<ScrollView>
				<View
					className="flex flex-row items-center w-10/12 mx-auto rounded-xl py-2 px-3 mt-4"
					style={{ backgroundColor: theme.colors.primary }}
				>
					<Ionicons name="bulb" size={24} color="white" />
					<Text
						className="text-[16px] w-10/12  mx-auto text-left"
						style={{ color: theme.colors.text }}
					>
						Vous pouvez sélectionner jusqu'à 20 habitudes
					</Text>
				</View>
				<View
					className="flex flex-col mt-6"
					style={{ backgroundColor: theme.colors.background }}
				>
					{habitsData.map((habit: any, index: any) => (
						<CardHabit key={index} habit={habit} navigation={navigation} />
					))}
				</View>
				<View />
				<Pressable
					className="w-10/12 mx-auto mt-6"
					style={{
						backgroundColor: theme.colors.primary,
						paddingVertical: 10,
						borderRadius: 10,
					}}
					onPress={() => navigation.navigate("index")}
				>
					<Text className="text-center text-xl" style={{ color: theme.colors.text }}>
						Valider
					</Text>
				</Pressable>
			</ScrollView>
		</ThemeProvider>
	);
}
