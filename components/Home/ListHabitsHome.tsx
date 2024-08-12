import TopRow from "@components/Habits/TopRow";
import { View } from "react-native";
import Congratulations from "./Congratulations";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "./ButtonViewMore";
import NoHabits from "./NoHabits";
import { Habit } from "../../types/habit";
import useIndex from "@hooks/useIndex";

export default function ListHabitsHome() {
	const {
		theme,
		userHabits,
		showMissingHabits,
		showMoreValidate,
		showMoreNext,
		missedHabitsCount,
		uncompletedHabitsData,
		completedHabitsData,
		hours,
		setShowMissingHabits,
		updateShowValidate,
		updateShowNext,
		handleHabitStatusChange,
	} = useIndex();
	return (
		<>
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
						uncompletedHabitsData.filter((habit: Habit) => habit.moment + 1 > hours)
							.length > 0 ? (
							<TopRow
								icon="close-circle"
								color={theme.colors.background}
								borderColor={theme.colors.primary}
								textColor={theme.colors.primary}
								text="Prochaines habitudes"
								number={
									uncompletedHabitsData.filter((habit: Habit) => habit.moment >= hours)
										.length
								}
							/>
						) : (
							<Congratulations
								theme={theme}
								completedHabitsData={completedHabitsData}
								userHabits={userHabits}
							/>
						)}

						{uncompletedHabitsData
							.filter((habit: Habit) => habit.moment >= hours)
							.slice(0, showMoreNext)
							.map((filteredHabit: any) => (
								<CardCheckHabit
									key={filteredHabit.id}
									habit={filteredHabit}
									onHabitStatusChange={handleHabitStatusChange}
								/>
							))}
						{uncompletedHabitsData.filter((habit: Habit) => habit.moment >= hours)
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
				<NoHabits theme={theme} />
			)}
		</>
	);
}
