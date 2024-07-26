import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
	View,
	RefreshControl,
	Pressable,
	ActivityIndicator,
	StatusBar,
	Image,
	Animated,
} from "react-native";
import {
	DarkTheme,
	useIsFocused,
	useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { getMemberHabits, getMemberInfos } from "../../db/member";
import CardCheckHabit from "../../components/Habits/CardCheckHabit";
import ActivitiesContainer from "../../components/Home/ActivitiesContainer";
import { Entypo } from "@expo/vector-icons";
import Background from "../../components/Svg/Background";
import TopRow from "../../components/Habits/TopRow";
import { UserContext } from "../../context/UserContext";
import ButtonViewMore from "../../components/Home/ButtonViewMore";
import ParallaxScrollView from "../../components/Home/ParallaxScrollView";
import { useData } from "../../context/DataContext";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const isMounted = useRef(true);
	const isFocused = useIsFocused();
	const rotation = useRef(new Animated.Value(0)).current;
	const { user } = useContext(UserContext);

	!user && navigation.navigate("login");

	const {
		habits,
		isLoading,
		uncompletedHabitsData,
		completedHabitsData,
		setUncompletedHabitsData,
		setCompletedHabitsData,
	} = useData();

	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [hours, setHours] = useState(new Date().getHours());

	const [memberInfos, setMemberInfos] = useState<any>([]);
	const [welcomeMessage, setWelcomeMessage] = useState("");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [showMoreValidate, setShowMoreValidate] = useState(5);
	const [showMoreNext, setShowMoreNext] = useState(5);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberInfos();
				setMemberInfos(data);
				setLoading(false);
			} catch (error) {
				handleError(error);
				setMemberInfos(null);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (isFocused) {
			backgroundRefresh();
		}
	}, [isFocused]);

	useEffect(() => {
		(async () => {
			const username = memberInfos && memberInfos.nom;
			const time = new Date().getHours();
			if (time < 12) {
				setWelcomeMessage(`Bonjour${username ? ", " + username : ""} !`);
			}
			if (time >= 12 && time < 18) {
				setWelcomeMessage(`Bon après-midi${username ? ", " + username : ""} !`);
			}
			if (time >= 18) {
				setWelcomeMessage(`Bonsoir${username ? ", " + username : ""} !`);
			}
		})();
	}, [memberInfos]);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			setShowMissingHabits(false);
			const data = await getMemberHabits();
			const memberInfos = await getMemberInfos();
			setMemberInfos(memberInfos);
			setUserHabits(data);
			setShowMoreValidate(5);
			setShowMoreNext(5);
		} catch (error) {
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	const backgroundRefresh = async () => {
		try {
			const data = await getMemberHabits();
			const memberInfos = await getMemberInfos();
			setMemberInfos(memberInfos);
			setUserHabits(data);
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setHours(new Date().getHours());
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setLoading(isLoading);
		setUserHabits(habits);

		return () => {
			isMounted.current = false;
		};
	}, [habits, isLoading, completedHabitsData, uncompletedHabitsData]);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	const handleHabitStatusChange = (habit: any, done: boolean) => {
		if (done) {
			setCompletedHabitsData((prevHabits: any) => [...prevHabits, habit] as any);
			setUncompletedHabitsData((prevHabits: any) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		} else {
			setUncompletedHabitsData((prevHabits: any) => [...prevHabits, habit] as any);
			setCompletedHabitsData((prevHabits: any) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habit.id)
			);
		}
	};

	const handlePressIn = () => {
		Animated.timing(rotation, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.timing(rotation, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const rotate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	if (loading || !userHabits || isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={{ color: theme.colors.text }} className="text-gray-600 mt-8">
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

	const missedHabitsCount = uncompletedHabitsData.filter(
		(habit: any) => habit.moment < hours
	).length;

	const updateShowValidate = () => {
		if (showMoreValidate < completedHabitsData.length) {
			setShowMoreValidate((prev) => prev + 5);
		} else {
			setShowMoreValidate(3);
		}
	};

	const updateShowNext = () => {
		if (showMoreNext < uncompletedHabitsData.length) {
			setShowMoreNext((prev) => prev + 5);
		} else {
			setShowMoreNext(3);
		}
	};

	const currentHour = new Date().getHours();
	const imageSource =
		currentHour >= 7 && currentHour < 20
			? require("../../assets/images/illustrations/temple_day.jpg")
			: require("../../assets/images/illustrations/temple_night.jpg");

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme ? theme.colors.background : theme.colors.background
				}
			/>

			<ParallaxScrollView
				habits={userHabits}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
				headerImage={
					<Image
						source={imageSource}
						style={{ width: "100%", height: 250, resizeMode: "cover" }}
					/>
				}
			>
				<Background />

				<View
					style={{ backgroundColor: "transparent" }}
					className="flex justify-between flex-row items-center mt-4 w-10/12 mx-auto"
				>
					<Text style={{ color: theme.colors.text }} className="text-xl font-bold">
						{welcomeMessage}
					</Text>
					<Animated.View style={{ transform: [{ rotate }] }}>
						<Pressable
							onPressIn={handlePressIn}
							onPressOut={handlePressOut}
							onPress={() => {
								navigation.navigate("select");
							}}
							className="rounded-full p-2"
							style={{
								backgroundColor: theme.colors.primary,
							}}
						>
							<Ionicons name="add" size={24} color="white" />
						</Pressable>
					</Animated.View>
				</View>

				{userHabits.length > 0 ? (
					<View
						className="flex flex-row flex-wrap justify-center mt-2"
						style={{ backgroundColor: "transparent" }}
					>
						<View
							className="flex flex-row flex-wrap justify-start py-2 mb-2"
							style={{ backgroundColor: "transparent" }}
						>
							{uncompletedHabitsData.length > 0 &&
							uncompletedHabitsData.filter((habit: any) => habit.moment + 1 > hours)
								.length > 0 ? (
								<TopRow
									icon="close-circle"
									color={theme.colors.background}
									borderColor={theme.colors.primary}
									textColor={theme.colors.primary}
									text="Prochaines habitudes"
									number={
										uncompletedHabitsData.filter((habit: any) => habit.moment >= hours)
											.length
									}
								/>
							) : (
								<View
									style={{
										// backgroundColor: theme.colors.greenSecondary,
										borderColor: theme.colors.primary,
										borderWidth: 2,
									}}
									className="rounded-lg flex-col flex items-center justify-center mx-auto w-[95%] py-2 px-4"
								>
									<View className="flex flex-row items-center justify-center w-10/12 mx-auto">
										<View className="mx-2">
											<Entypo name="trophy" size={24} color={theme.colors.primary} />
										</View>
										<Text
											className="mx-2 font-bold text-lg"
											style={{ color: theme.colors.primary }}
										>
											Félicitations !
										</Text>
									</View>
									<Text
										style={{ color: theme.colors.primary }}
										className="text-center w-3/4 mx-auto mt-2"
									>
										{completedHabitsData.length === userHabits.length
											? `Vous avez validé toutes vos habitudes pour aujourd'hui !`
											: `Vous n'avez pas d'habitudes à valider pour le moment.`}
									</Text>
								</View>
							)}

							{uncompletedHabitsData
								.filter((habit: any) => habit.moment >= hours)
								.slice(0, showMoreNext)
								.map((filteredHabit: any) => (
									<CardCheckHabit
										key={filteredHabit.id}
										habit={filteredHabit}
										onHabitStatusChange={handleHabitStatusChange}
									/>
								))}
							{uncompletedHabitsData.filter((habit: any) => habit.moment >= hours)
								.length > 3 ? (
								<ButtonViewMore
									onPress={updateShowNext}
									text={
										showMoreNext < uncompletedHabitsData.length
											? "Voir plus"
											: "Voir moins"
									}
								/>
							) : null}
						</View>
						<View
							className="flex flex-row flex-wrap justify-start py-2 mb-2"
							style={{ backgroundColor: "transparent" }}
						>
							<TopRow
								icon="checkmark-circle"
								color={theme.colors.background}
								borderColor={theme.colors.greenPrimary}
								textColor={theme.colors.greenPrimary}
								text="Validées"
								number={completedHabitsData.length}
							/>
							<View className="w-full mx-auto">
								{[
									...new Map(
										completedHabitsData.map((item: any) => [item.id, item])
									).values(),
								]
									.slice(0, showMoreValidate)
									.map((filteredHabit: any) => (
										<CardCheckHabit
											completed={true}
											key={filteredHabit.id}
											habit={filteredHabit}
											onHabitStatusChange={handleHabitStatusChange}
											disabled={true}
										/>
									))}

								{completedHabitsData.length > 3 ? (
									<ButtonViewMore
										onPress={updateShowValidate}
										text={
											showMoreValidate < completedHabitsData.length
												? "Voir plus"
												: "Voir moins"
										}
									/>
								) : null}
							</View>
						</View>
						{uncompletedHabitsData.length > 0 &&
							uncompletedHabitsData.filter((habit: any) => habit.moment < hours)
								.length > 0 && (
								<View
									className="flex flex-row flex-wrap justify-start py-2 mb-2"
									style={{ backgroundColor: "transparent" }}
								>
									<TopRow
										icon="close-circle"
										color={theme.colors.background}
										borderColor={theme.colors.redPrimary}
										textColor={theme.colors.redPrimary}
										text="Manquées"
										number={missedHabitsCount}
									/>

									{showMissingHabits ? (
										<View
											style={{ backgroundColor: "transparent" }}
											className=" flex flex-col w-full"
										>
											{uncompletedHabitsData
												.filter((habit: any) => habit.moment < hours)
												.map((filteredHabit: any) => (
													<CardCheckHabit
														key={filteredHabit.id}
														habit={filteredHabit}
														onHabitStatusChange={handleHabitStatusChange}
													/>
												))}
											<ButtonViewMore
												onPress={() => setShowMissingHabits(false)}
												text="Cacher les habitudes manquées"
											/>
										</View>
									) : (
										<ButtonViewMore
											onPress={() => setShowMissingHabits(true)}
											text="Voir les habitudes manquées"
										/>
									)}
								</View>
							)}
					</View>
				) : (
					<View className="flex flex-col py-24 items-center justify-center">
						<Image
							source={require("../../assets/images/illustrations/not_found.png")}
							style={{ width: 250, height: 250, resizeMode: "contain" }}
						/>
						<Text style={{ color: theme.colors.text }} className="text-center mt-6">
							Aucune habitude trouvée. Ajoutez-en une !
						</Text>
					</View>
				)}
				{userHabits.length > 0 && <ActivitiesContainer userHabits={userHabits} />}
			</ParallaxScrollView>
		</>
	);
}
