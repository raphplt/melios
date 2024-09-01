import EditHabitCard from "@components/EditHabits/EditHabitCard";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { UserHabit } from "../types/userHabit";
import { Iconify } from "react-native-iconify";

export default function EditHabits() {
	const { theme } = useContext(ThemeContext);
	const { habits } = useData();
	const [searchText, setSearchText] = useState("");

	const filteredHabits = habits.filter((habit: UserHabit) =>
		habit.name.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: theme.colors.background }}
			>
				<View
					className="w-11/12 mx-auto my-6 py-3 px-4 rounded-xl"
					style={{
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<Iconify
						icon="mdi:magnify"
						size={20}
						color={theme.colors.text}
						className="absolute ml-3"
					/>
					<TextInput
						placeholder="Rechercher une habitude"
						placeholderTextColor={theme.colors.text}
						className=""
						value={searchText}
						style={{
							color: theme.colors.text,
						}}
						onChangeText={setSearchText}
					/>
				</View>
				{filteredHabits.map((habit: UserHabit) => (
					<EditHabitCard key={habit.id} habit={habit} />
				))}
			</ScrollView>
		</>
	);
}
