import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import {
	View,
	RefreshControl,
	Pressable,
	ActivityIndicator,
	StatusBar,
	Image,
	Animated,
} from "react-native";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { getMemberHabits, getMemberInfos } from "../../db/member";
import CardCheckHabit from "../../components/habits/CardCheckHabit";
import moment from "moment";
import ActivitiesContainer from "../../components/ActivitiesContainer";
import { Entypo } from "@expo/vector-icons";
import Background from "../../components/Svg/Background";
import TopRow from "../../components/habits/TopRow";
import { UserContext } from "../../constants/UserContext";
import ButtonViewMore from "../../components/ButtonViewMore";
import ParallaxScrollView from "../../components/ParallaxScrollView";

export default function Index() {
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();
	const isMounted = useRef(true);
	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [hours, setHours] = useState(new Date().getHours());
	const [completedHabits, setCompletedHabits] = useState([]);
	const [uncompletedHabits, setUncompletedHabits] = useState([]);
	const [memberInfos, setMemberInfos] = useState<any>([]);
	const [welcomeMessage, setWelcomeMessage] = useState("");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [showMoreValidate, setShowMoreValidate] = useState(3);
	const [showMoreNext, setShowMoreNext] = useState(3);
	const rotation = useRef(new Animated.Value(0)).current;
	const { user } = useContext(UserContext);

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
			setShowMoreValidate(3);
			setShowMoreNext(3);
		} catch (error) {
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
			setHours(new Date().getHours());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				// if (isMounted.current) {
				setUserHabits(data);
				setLoading(false);
				// }
			} catch (error) {
				handleError(error);
				setUserHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, [memberInfos]);

	useEffect(() => {
		const completedHabits = userHabits
			.filter((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date === date && lastLog.done === true) {
						return true;
					}
				}
			})
			.sort((a: any, b: any) => a.moment - b.moment);

		const uncompletedHabits = userHabits
			.filter((habit: any) => {
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
			})
			.sort((a: any, b: any) => a.moment - b.moment);
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

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={{ color: theme.colors.text }} className="text-lg mt-8">
					Chargement des habitudes...
				</Text>
			</View>
		);
	}

	const missedHabitsCount = uncompletedHabits.filter(
		(habit: any) => habit.moment < hours
	).length;

	const updateShowValidate = () => {
		if (showMoreValidate < completedHabits.length) {
			setShowMoreValidate((prev) => prev + 5);
		} else {
			setShowMoreValidate(3);
		}
	};

	const updateShowNext = () => {
		if (showMoreNext < uncompletedHabits.length) {
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

	!user && navigation.navigate("login");

	return (
		<>
			<StatusBar
				barStyle={theme === DarkTheme ? "light-content" : "dark-content"}
				backgroundColor={
					theme === DarkTheme ? theme.colors.background : theme.colors.background
				}
			/>
			{/* <ScrollView
				className=" overflow-y-hidden"
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			> */}
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
				{/* <View style={{ backgroundColor: "transparent" }}>
					<TopStats habits={userHabits} />
				</View> */}

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
							{uncompletedHabits.length > 0 &&
							uncompletedHabits.filter((habit: any) => habit.moment + 1 > hours)
								.length > 0 ? (
								<TopRow
									icon="close-circle"
									color={theme.colors.yellowPrimary}
									text="Prochaines habitudes"
									number={
										uncompletedHabits.filter((habit: any) => habit.moment >= hours).length
									}
								/>
							) : (
								<View
									style={{
										backgroundColor: theme.colors.greenSecondary,
										borderColor: theme.colors.greenPrimary,
										borderWidth: 2,
									}}
									className="rounded-lg flex-col flex items-center justify-center mx-auto w-[95%] py-2 px-4"
								>
									<View className="flex flex-row items-center justify-center w-10/12 mx-auto">
										<View className="mx-2">
											<Entypo name="trophy" size={24} color="black" />
										</View>
										<Text
											className="mx-2 font-semibold text-lg"
											style={{ color: "black" }}
										>
											Félicitations !
										</Text>
									</View>
									<Text
										style={{ color: "black" }}
										className="text-center w-3/4 mx-auto mt-2"
									>
										{completedHabits.length === userHabits.length
											? `Vous avez validé toutes vos habitudes pour aujourd'hui !`
											: `Vous n'avez pas d'habitudes à valider pour le moment.`}
									</Text>
								</View>
							)}

							{uncompletedHabits
								.filter((habit: any) => habit.moment >= hours)
								.slice(0, showMoreNext)
								.map((filteredHabit: any) => (
									<CardCheckHabit
										key={filteredHabit.id}
										habit={filteredHabit}
										onHabitStatusChange={handleHabitStatusChange}
									/>
								))}
							{uncompletedHabits.filter((habit: any) => habit.moment >= hours).length >
							3 ? (
								<ButtonViewMore
									onPress={updateShowNext}
									text={
										showMoreNext < uncompletedHabits.length ? "Voir plus" : "Voir moins"
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
								color={theme.colors.greenPrimary}
								text="Validées"
								number={completedHabits.length}
							/>
							<View className="w-full mx-auto">
								{[
									...new Map(
										completedHabits.map((item: any) => [item.id, item])
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

								{completedHabits.length > 3 ? (
									<ButtonViewMore
										onPress={updateShowValidate}
										text={
											showMoreValidate < completedHabits.length
												? "Voir plus"
												: "Voir moins"
										}
									/>
								) : null}
							</View>
						</View>
						{uncompletedHabits.length > 0 &&
							uncompletedHabits.filter((habit: any) => habit.moment < hours).length >
								0 && (
								<View
									className="flex flex-row flex-wrap justify-start py-2 mb-2"
									style={{ backgroundColor: "transparent" }}
								>
									<TopRow
										icon="close-circle"
										color={theme.colors.redPrimary}
										text="Manquées"
										number={missedHabitsCount}
									/>

									{showMissingHabits ? (
										<View
											style={{ backgroundColor: "transparent" }}
											className=" flex flex-col w-full"
										>
											{uncompletedHabits
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

			{/* </ScrollView> */}
		</>
	);
}
