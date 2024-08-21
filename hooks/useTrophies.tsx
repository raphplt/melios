import { DataContext } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { getAllTrophies } from "@db/trophiesList";
import { useContext, useEffect } from "react";
import { Habit } from "../types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runTests } from "@utils/habits";

const useTrophies = () => {
	const { trophies, setTrophies } = useContext(DataContext);
	const { habitQueue, setHabitQueue } = useHabits();

	useEffect(() => {
		const fetchTrophies = async () => {
			if (trophies.length === 0) {
				const fetchedTrophies = await getAllTrophies();
				setTrophies(fetchedTrophies);
			}
		};

		fetchTrophies();
	}, [trophies, setTrophies]);

	const addHabitToQueue = (habit: Habit) => {
		setHabitQueue((prev) => [...prev, habit]);
		AsyncStorage.setItem("habitQueue", JSON.stringify([...habitQueue, habit]));
	};

	useEffect(() => {
		console.log("trophies", habitQueue);
		runTests(habitQueue);
	}, [habitQueue]);

	return { addHabitToQueue };
};

export default useTrophies;