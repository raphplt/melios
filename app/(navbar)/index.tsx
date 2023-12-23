import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import TopStats from "../../components/TopStats";
import { ThemeProvider, useNavigation } from "@react-navigation/native";
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
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setUserHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setLoading(false);
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

	const handleHabitStatusChange = (habitId: any, done: boolean) => {
		// Update the userHabits state based on the status change
		setUserHabits((prevHabits: any) =>
			prevHabits.map((habit: any) =>
				habit.id === habitId ? { ...habit, done } : habit
			)
		);
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

	return (
		<ThemeProvider value={theme}>
			<ScrollView
				className="mb-8"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={{ backgroundColor: theme.colors.background }}>
					<TopStats habits={userHabits} />
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
						Mes habitudes
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
						className="flex flex-row flex-wrap justify-center mt-4"
						style={{ backgroundColor: theme.colors.background }}
					>
						<View
							className="flex flex-row flex-wrap justify-start"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text
								style={{ color: theme.colors.text }}
								className="w-10/12 mx-auto text-lg"
							>
								A faire aujourd'hui :
							</Text>

							{userHabits
								.filter(
									(habit: any) =>
										habit.logs.length === 0 ||
										(habit.logs.length > 0 &&
											habit.logs[habit.logs.length - 1] &&
											(habit.logs[habit.logs.length - 1].date !== date ||
												habit.logs[habit.logs.length - 1].done === false))
								)
								.map((filteredHabit: any) => (
									<CardCheckHabit
										key={filteredHabit.id}
										habit={filteredHabit}
										onHabitStatusChange={handleHabitStatusChange}
									/>
								))}
						</View>
						<View
							className="flex flex-row flex-wrap justify-start"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text
								style={{ color: theme.colors.text }}
								className="w-10/12 mx-auto text-lg"
							>
								Déjà réalisées :
							</Text>

							{userHabits
								.filter(
									(habit: any) =>
										habit.logs &&
										habit.logs[habit.logs.length - 1] &&
										habit.logs[habit.logs.length - 1].date === date &&
										habit.logs[habit.logs.length - 1].done === true
								)
								.map((filteredHabit: any) => (
									<CardCheckHabit
										key={filteredHabit.id}
										habit={filteredHabit}
										onHabitStatusChange={handleHabitStatusChange}
									/>
								))}
						</View>
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
