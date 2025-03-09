import Activity from "./ActivityCard";
import { FlatList, View, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";

import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import { HabitType } from "@utils/category.type";

export default function ActivitiesContainer() {
	const { habits } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	if (!habits || habits.length === 0) {
		return null;
	}

	// Filter positives habits only
	const filteredHabits = habits.filter(
		(habit) => habit.type !== HabitType.negative
	);

	return (
		<View
			className="mt-8 py-4 mb-5 pb-10 rounded-xl ml-3 z-[1000]"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Text
				className="text-[18px] mb-4 mt-1 w-11/12 mx-auto"
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
			>
				{t("my_activities")}
			</Text>
			<FlatList
				horizontal={true}
				data={filteredHabits}
				renderItem={({ item }) => <Activity habit={item} />}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={{ paddingLeft: 8 }}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
}
