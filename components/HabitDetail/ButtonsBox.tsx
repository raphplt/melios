import { View } from "react-native";
import ButtonComplete from "./ButtonComplete";
import ButtonStartHabit from "./ButtonStartHabit";
import { useHabits } from "@context/HabitsContext";
import { useData } from "@context/DataContext";
import { HabitType } from "@utils/category.type";

export default function ButtonsBox() {
	const { currentHabit } = useHabits();
	const { completedHabitsToday } = useData();

	const isHabitCompleted = completedHabitsToday.some(
		(habit) => habit.id === currentHabit?.id
	);

	const habitHasDuration = currentHabit && currentHabit.duration;
	const isNegativeHabit = currentHabit?.type === HabitType.negative;

	return (
		<View className="py-6 mb-10">
			{!isHabitCompleted ? (
				<View className="flex flex-row justify-evenly w-11/12 mx-auto">
					{habitHasDuration && !isNegativeHabit && (
						<View style={{ flex: 0.5 }}>
							<ButtonStartHabit />
						</View>
					)}
					<View style={{ flex: 0.5 }}>
						<ButtonComplete />
					</View>
				</View>
			) : null}
		</View>
	);
}