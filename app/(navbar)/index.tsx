import React from "react";
import { View, RefreshControl, StatusBar, Image } from "react-native";
import { DarkTheme } from "@react-navigation/native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import useIndex from "@hooks/useIndex";
import ParallaxScrollView from "@components/Home/ParallaxScrollView";
import Background from "@components/Svg/Background";
import TopRow from "@components/Habits/TopRow";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "@components/Home/ButtonViewMore";
import ActivitiesContainer from "@components/Home/ActivitiesContainer";
import LoaderScreen from "@components/Shared/LoaderScreen";
import WelcomeRow from "@components/Home/WelcomeRow";

export default function Index() {
	const {
		theme,
		navigation,
		user,
		userHabits,
		loading,
		refreshing,
		welcomeMessage,
		showMissingHabits,
		showMoreValidate,
		showMoreNext,
		missedHabitsCount,
		rotate,
		imageSource,
		uncompletedHabitsData,
		completedHabitsData,
		hours,
		isLoading,
		isDayTime,
		setShowMissingHabits,
		updateShowValidate,
		updateShowNext,
		onRefresh,
		handleHabitStatusChange,
		handlePressIn,
		handlePressOut,
	} = useIndex();

	!user && navigation.navigate("login");

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text="Chargement de vos habitudes..." />;
	}

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
				isDayTime={isDayTime}
			>
				<Background />

				<WelcomeRow
					theme={theme}
					navigation={navigation}
					welcomeMessage={welcomeMessage}
					rotation={rotate}
					rotate={rotate}
					handlePressIn={handlePressIn}
					handlePressOut={handlePressOut}
				/>

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
