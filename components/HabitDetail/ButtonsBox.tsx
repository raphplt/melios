import { View } from "react-native";
import ButtonComplete from "./ButtonComplete";
import ButtonStartHabit from "./ButtonStartHabit";
import Separator from "./Separator";
import { useHabits } from "@context/HabitsContext";
import { useData } from "@context/DataContext";
import HabitDone from "./HabitDone";

export default function ButtonsBox() {
	const { currentHabit } = useHabits();
	const { completedHabitsToday } = useData();

	const isHabitCompleted = completedHabitsToday.some(
		(habit) => habit.id === currentHabit?.id
	);

	const habitHasDuration = currentHabit && currentHabit.duration;

	return (
		<View className="py-6">
			{!isHabitCompleted ? (
				<View>
					{habitHasDuration ? (
						<View>
							<ButtonStartHabit />
							<Separator />
						</View>
					) : null}
					<ButtonComplete />
				</View>
			) : (
				<HabitDone />
			)}
		</View>
	);
}