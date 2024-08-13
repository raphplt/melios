import { useState, useEffect } from "react";
import { getHabitsWithCategories } from "../db/fetch";
import { Habit } from "../types/habit";

const useHabitsData = () => {
	const [habitsData, setHabitsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [displayedHabitsCount, setDisplayedHabitsCount] = useState({});
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		const fetchHabitsData = async () => {
			try {
				const data = await getHabitsWithCategories();
				setHabitsData(data);
				setLoading(false);
				//TODO type this
				const initialDisplayedCounts = data.reduce((acc, habit) => {
					acc[habit.id] = habit.initialCount || 0;
					return acc;
				}, {});
				setDisplayedHabitsCount(initialDisplayedCounts);
			} catch (error) {
				console.error("Failed to fetch habits", error);
				setLoading(false);
			}
		};

		fetchHabitsData();
	}, []);

	const filteredHabits = habitsData.filter(
		(habit: Habit) =>
			habit.name.toLowerCase().includes(search.toLowerCase()) &&
			(!selectedCategory || habit.category.id === selectedCategory)
	);

	return {
		habitsData: filteredHabits,
		loading,
		search,
		setSearch,
		displayedHabitsCount,
		selectedCategory,
		setSelectedCategory,
	};
};

export default useHabitsData;