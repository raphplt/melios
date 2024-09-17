import { useContext } from "react";
import Activity from "./ActivityCard";
import { FlatList, View, Text } from "react-native";
import { ThemeContext } from "@context/ThemeContext";
import { UserHabit } from "../../type/userHabit";
import useIndex from "@hooks/useIndex";

export default function ActivitiesContainer() {
	const { userHabits } = useIndex();
	const { theme } = useContext(ThemeContext);

	if (!userHabits || userHabits.length === 0) {
		return null;
	}

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
				Mes activités
			</Text>
			<FlatList
				horizontal={true}
				data={userHabits}
				renderItem={({ item }) => <Activity userHabit={item} />}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={{ paddingLeft: 8 }}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
}