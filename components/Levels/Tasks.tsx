import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";

const Tasks = () => {
	const { theme } = useTheme();
	// const { hab} = useHabits()
	return (
		<View>
			<Text>Tasks</Text>
		</View>
	);
};

export default Tasks;
