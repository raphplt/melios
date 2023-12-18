import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { View, ScrollView, RefreshControl } from "react-native";
import TopStats from "../../components/TopStats";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../../components/CardHabit";
import { useNavigation } from "expo-router";
import { getAllHabits } from "../../db/habits";
import { Text } from "react-native";
import { getMemberHabits } from "../../db/member";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await getMemberHabits();
			setUserHabits(data);
		} catch (error) {
			console.error("Erreur lors de la récupération des habitudes : ", error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getMemberHabits();
				setUserHabits(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des habitudes : ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHabitsData();
	}, []);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.colors.text }}>
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

	return (
		<ThemeProvider value={theme}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={{ backgroundColor: theme.colors.background }}>
					<TopStats />
				</View>

				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-center text-xl mt-6"
				>
					Mes bonnes habitudes
				</Text>

				{userHabits.length > 0 ? (
					<View
						className="flex flex-row flex-wrap justify-center mt-6"
						style={{ backgroundColor: theme.colors.background }}
					>
						{userHabits.map((habit: any) => (
							<CardHabit key={habit.id} habit={habit} navigation={navigation} />
						))}
					</View>
				) : (
					<Text style={{ color: theme.colors.text }}>Aucune habitude trouvée.</Text>
				)}

				<View />
			</ScrollView>
		</ThemeProvider>
	);
}
