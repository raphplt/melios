import { View } from "react-native";
import ButtonComplete from "./ButtonComplete";
import ButtonStartHabit from "./ButtonStartHabit";
import { useHabits } from "@context/HabitsContext";
import { useData } from "@context/DataContext";
import HabitDone from "./HabitDone";
import { CategoryTypeSelect } from "@utils/category.type";

export default function ButtonsBox() {
	const { currentHabit } = useHabits();
	const { completedHabitsToday } = useData();

	const isHabitCompleted = completedHabitsToday.some(
		(habit) => habit.id === currentHabit?.id
	);

	const habitHasDuration = currentHabit && currentHabit.duration;
	const isNegativeHabit = currentHabit?.type === CategoryTypeSelect.negative;

	return (
		<View className="py-6">
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
			) : (
				<HabitDone />
			)}
		</View>
	);
}