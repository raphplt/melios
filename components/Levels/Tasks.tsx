import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";

const Tasks = () => {
	const { theme } = useTheme();
	const { habits } = useData();
	return (
		<View>
			<Text>Tasks</Text>
		</View>
	);
};

export default Tasks;
