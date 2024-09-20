import EditHabitCard from "@components/EditHabits/EditHabitCard";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { UserHabit } from "../type/userHabit";
import { Iconify } from "react-native-iconify";
import NumberSelected from "@components/Select/NumberSelected";
import { Habit } from "@type/habit";

export default function EditHabits() {
	const { theme } = useContext(ThemeContext);
	const { habits, setHabits } = useData();
	const [searchText, setSearchText] = useState("");

	const filteredHabits = habits.filter((habit: UserHabit) =>
		habit.name.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<View style={{ backgroundColor: theme.colors.background }} className="flex-1">
			<View className="w-11/12 hfu flex flex-row items-center mx-auto">
				<View
					className="flex flex-row items-center w-10/12 my-6 py-2 px-4 rounded-3xl"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.primary,
						borderWidth: 1,
					}}
				>
					<Iconify icon="mdi:magnify" size={20} color={theme.colors.text} />
					<TextInput
						placeholder="Rechercher une habitude"
						placeholderTextColor={theme.colors.text}
						className="ml-1"
						value={searchText}
						style={{
							color: theme.colors.text,
						}}
						onChangeText={setSearchText}
					/>
				</View>
				<NumberSelected number={habits.length} />
			</View>

			<FlatList
				data={filteredHabits}
				keyExtractor={(item: UserHabit) => item.id.toString()}
				renderItem={({ item }) => <EditHabitCard habit={item} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}