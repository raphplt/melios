import EditHabitCard from "@components/EditHabits/EditHabitCard";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import { UserHabit } from "@type/userHabit";
import { useTranslation } from "react-i18next";
import Animated, { LinearTransition } from "react-native-reanimated";

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
		<Animated.FlatList
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={{ flexGrow: 1 }}
			ListHeaderComponent={
				<View className="w-11/12 flex flex-row items-center mx-auto mb-4">
					<View
						className="flex flex-row items-center rounded-xl flex-1"
						style={{
							backgroundColor: theme.colors.background,
							borderColor: theme.colors.border,
							borderWidth: 1,
						}}
					>
						<View className="flex flex-row items-center p-2">
							<Iconify icon="mdi:magnify" size={20} color={theme.colors.text} />
						</View>
						<TextInput
							placeholder={t("search_habit")}
							placeholderTextColor={theme.colors.text}
							className="flex-1 py-3"
							value={searchText}
							style={{
								color: theme.colors.text,
							}}
							onChangeText={setSearchText}
						/>
					</View>
					<View
						style={{ backgroundColor: theme.colors.primary }}
						className="px-3 rounded-3xl flex flex-row items-center py-4 ml-2"
					>
						<Text className="w-fit font-semibold text-white">{habits.length}/10</Text>
					</View>
				</View>
			}
			data={filteredHabits}
			keyExtractor={(item: UserHabit) => item.id.toString()}
			renderItem={({ item }) => <EditHabitCard habit={item} />}
			showsVerticalScrollIndicator={false}
			keyboardDismissMode="on-drag"
			itemLayoutAnimation={LinearTransition}
		/>
	);
}