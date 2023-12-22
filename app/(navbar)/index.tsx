import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import TopStats from "../../components/TopStats";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../../components/CardHabit";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { getMemberHabits } from "../../db/member";
import CardCheckHabit from "../../components/CardCheckHabit";
import moment from "moment";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	const isMounted = useRef(true);
	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await getMemberHabits();
			if (isMounted.current) {
				setUserHabits(data);
			}
		} catch (error) {
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setUserHabits(data);
					setLoading(false); // Définissez loading à false après la requête
				}
			} catch (error) {
				handleError(error);
				setLoading(false); // Définissez loading à false en cas d'erreur
			}
		};

		fetchHabitsData();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleError = (error: any) => {
		console.error("Erreur lors de la récupération des habitudes : ", error);
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.colors.text }}>
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

	// Reste du code pour le rendu normal
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
				<View
					style={{ backgroundColor: theme.colors.background }}
					className="flex justify-between flex-row items-center mt-4 w-10/12 mx-auto"
				>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-center text-xl"
					>
						Mes bonnes habitudes
					</Text>
					<Pressable
						onPress={() => navigation.navigate("select")}
						className="bg-blue-500 rounded-full p-2"
					>
						<Ionicons name="add" size={24} color="white" />
					</Pressable>
				</View>

				{userHabits.length > 0 ? (
					<View
						className="flex flex-row flex-wrap justify-center mt-6"
						style={{ backgroundColor: theme.colors.background }}
					>
						<View
							className="flex flex-row flex-wrap justify-center"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text style={{ color: theme.colors.text }}>
								Habitudes à faire aujourd'hui :
							</Text>

							{userHabits.map((habit: any) => (
								<CardCheckHabit key={habit.id} habit={habit} />
							))}
						</View>
						{/* <View
							className="flex flex-row flex-wrap justify-center"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text style={{ color: theme.colors.text }}>
								Habitudes déjà faites aujourd'hui :
							</Text>
							{userHabits.map(
								(habit: any) =>
									habit.logs[0] &&
									habit.logs[0].done && <CardCheckHabit key={habit.id} habit={habit} />
							)}
						</View> */}
					</View>
				) : (
					<Text style={{ color: theme.colors.text }} className="text-center">
						Aucune habitude trouvée. (Refresh pour les afficher)
					</Text>
				)}

				<View />
			</ScrollView>
		</ThemeProvider>
	);
}
