import { useContext } from "react";
import Activity from "./Activity";
import { ThemeContext } from "./ThemContext";
import { ScrollView, View, Text } from "react-native";

export default function ActivitiesContainer({ userHabits }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="mt-6">
			<Text
				className="text-2xl font-bold mb-3 w-10/12 mx-auto"
				style={{
					color: theme.colors.text,
				}}
			>
				Activités
			</Text>
			<ScrollView
				horizontal={true}
				className="ml-6"
				style={{
					backgroundColor: theme.colors.background,
				}}
			>
				{userHabits.map((habit: any, index: number) => {
					return <Activity key={index} habit={habit} />;
				})}
			</ScrollView>
		</View>
	);
}
