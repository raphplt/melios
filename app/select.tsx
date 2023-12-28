import { useNavigation } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { getAllHabits } from "../db/habits";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../components/CardHabit";
import TopStats from "../components/TopStats";

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
				<Text
					className="text-xl w-10/12 text-center mx-auto mt-6"
					style={{ color: theme.colors.text }}
				>
					Choisissez vos habitudes
				</Text>
				<View
					className="flex flex-col mt-6"
					style={{ backgroundColor: theme.colors.background }}
				>
					{habitsData.map((habit: any, index: any) => (
						<CardHabit key={index} habit={habit} navigation={navigation} />
					))}
				</View>
				<View />
			</ScrollView>
		</ThemeProvider>
	);
}
