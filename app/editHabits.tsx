import EditHabitCard from "@components/EditHabits/EditHabitCard";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { FlatList, View, TextInput } from "react-native";
import { Iconify } from "react-native-iconify";
import NumberSelected from "@components/Select/Old/NumberSelected";
import { UserHabit } from "@type/userHabit";
import { useTranslation } from "react-i18next";

export default function EditHabits() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { habits } = useData();
	const [searchText, setSearchText] = useState("");

	const filteredHabits =
		habits &&
		habits.filter((habit: UserHabit) =>
			habit.name.toLowerCase().includes(searchText.toLowerCase())
		);

	return (
		<FlatList
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={{ flexGrow: 1 }}
			ListHeaderComponent={
				<View className="w-[95%] flex flex-row items-center mx-auto">
					<View
						className="flex flex-row items-center w-[80%] my-6 py-1 px-4 rounded-3xl"
						style={{
							backgroundColor: theme.colors.background,
							borderColor: theme.colors.primary,
							borderWidth: 1,
						}}
					>
						<Iconify icon="mdi:magnify" size={20} color={theme.colors.text} />
						<TextInput
							placeholder={t("search_habit")}
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
			}
			data={filteredHabits}
			keyExtractor={(item: UserHabit) => item.id.toString()}
			renderItem={({ item }) => <EditHabitCard habit={item} />}
			showsVerticalScrollIndicator={false}
		/>
	);
}