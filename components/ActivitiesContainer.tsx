import { useContext } from "react";
import Activity from "./Activity";
import { ThemeContext } from "./ThemContext";
import { ScrollView, View, Text } from "react-native";

export default function ActivitiesContainer({ userHabits }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="mt-8 py-4 mb-5 pb-10 rounded-t-2xl"
			style={{
				backgroundColor: theme.colors.primary,
			}}
		>
			<Text
				className="text-lg font-bold mb-3 w-10/12 mx-auto"
				style={{
					color: theme.colors.textSecondary,
				}}
			>
				Activités à faire
			</Text>
			<ScrollView
				horizontal={true}
				className="ml-2"
				showsHorizontalScrollIndicator={false}
			>
				{userHabits.map((habit: any, index: number) => {
					return <Activity key={index} habit={habit} />;
				})}
			</ScrollView>
		</View>
	);
}
