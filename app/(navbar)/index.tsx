import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import {
	View,
	ScrollView,
	RefreshControl,
	Pressable,
	ActivityIndicator,
	StatusBar,
} from "react-native";
import TopStats from "../../components/TopStats";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { getMemberHabits, getMemberInfos } from "../../db/member";
import CardCheckHabit from "../../components/CardCheckHabit";
import moment from "moment";
import ActivitiesContainer from "../../components/ActivitiesContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	const isMounted = useRef(true);
	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [completedHabits, setCompletedHabits] = useState([]);
	const [uncompletedHabits, setUncompletedHabits] = useState([]);
	const [memberInfos, setMemberInfos] = useState<any>([]);

	const [welcomeMessage, setWelcomeMessage] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberInfos();
				setMemberInfos(data);
				setLoading(false);
			} catch (error) {
				handleError(error);
				setMemberInfos([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		(async () => {
			const username = memberInfos.nom;
			const time = new Date().getHours();
			if (time < 12) {
				setWelcomeMessage(`Bonjour, ${username} !`);
			}
			if (time >= 12 && time < 18) {
				setWelcomeMessage(`Bon après-midi, ${username} !`);
			}
			if (time >= 18) {
				setWelcomeMessage(`Bonsoir, ${username} !`);
			}
		})();
	}, [memberInfos.nom]);

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
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setUserHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setUserHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const completedHabits = userHabits.filter((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					return true;
				}
			}
		});

		const uncompletedHabits = userHabits.filter((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date !== date) {
					return true;
				}
				if (lastLog && lastLog.date === date && lastLog.done === false) {
					return true;
				} else if (habit.logs.length === 0) {
					return true;
				}
			}
		});

		setCompletedHabits(completedHabits);
		setUncompletedHabits(uncompletedHabits);
	}, [userHabits, date]);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	const handleHabitStatusChange = (habit: any, done: boolean) => {
		if (done) {
			setCompletedHabits((prevHabits) => [...prevHabits, habit] as any);
			setUncompletedHabits((prevHabits) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		} else {
			setUncompletedHabits((prevHabits) => [...prevHabits, habit] as any);
			setCompletedHabits((prevHabits) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		}
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={"#007aff"} />
				<Text style={{ color: theme.colors.text }} className="text-lg mt-8">
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme
						? theme.colors.backgroundSecondary
						: theme.colors.backgroundSecondary
				}
			/>
			<ScrollView
				className=""
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
					<Text style={{ color: theme.colors.text }} className="text-lg font-bold">
						{welcomeMessage}
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
						className="flex flex-row flex-wrap justify-center mt-2"
						style={{ backgroundColor: theme.colors.background }}
					>
						<View
							className="flex flex-row flex-wrap justify-star py-3  mb-2"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text
								style={{ color: theme.colors.text }}
								className="w-10/12 mx-auto text-[16px] font-semibold mb-2"
							>
								{uncompletedHabits.length > 0 ? (
									<Text>⏳ Restantes : {uncompletedHabits.length}</Text>
								) : (
									<View className=" bg-green-300 rounded-lg py-2 px-4">
										<Text className="">
											Félicitations, vous avez terminé toutes vos habitudes !
										</Text>
									</View>
								)}
							</Text>

							{uncompletedHabits.map((filteredHabit: any) => (
								<CardCheckHabit
									key={filteredHabit.id}
									habit={filteredHabit}
									onHabitStatusChange={handleHabitStatusChange}
									completedHabits={completedHabits}
									setCompletedHabits={setCompletedHabits}
									uncompletedHabits={uncompletedHabits}
									setUncompletedHabits={setUncompletedHabits}
								/>
							))}
						</View>
						<View
							className="flex flex-row flex-wrap justify-start py-3 mb-2"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Text
								style={{ color: theme.colors.text }}
								className="w-10/12 mx-auto text-[16px] font-semibold mb-2"
							>
								✔️ Déjà réalisées : {completedHabits.length}
							</Text>

							{completedHabits.map((filteredHabit: any) => (
								<CardCheckHabit
									completed={true}
									key={filteredHabit.id}
									habit={filteredHabit}
									onHabitStatusChange={handleHabitStatusChange}
									completedHabits={completedHabits}
									setCompletedHabits={setCompletedHabits}
									uncompletedHabits={uncompletedHabits}
									setUncompletedHabits={setUncompletedHabits}
								/>
							))}
						</View>
					</View>
				) : (
					<Text style={{ color: theme.colors.text }} className="text-center mt-48">
						Aucune habitude trouvée. Ajoutez-en une !
					</Text>
				)}

				<ActivitiesContainer userHabits={userHabits} />
			</ScrollView>
		</>
	);
}
