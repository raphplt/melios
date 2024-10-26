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

	const completed = completedHabitsToday.some(
		(habit) => habit.id === currentHabit?.id
	);

	return (
		<View className="py-3">
			{!completed ? (
				<>
					<ButtonStartHabit />
					<Separator />
					<ButtonComplete />
				</>
			) : (
				<HabitDone />
			)}
		</View>
	);
}
