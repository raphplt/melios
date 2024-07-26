import { useContext } from "react";
import Activity from "./Activity";
import { ThemeContext } from "../../context/ThemeContext";
import { ScrollView, View, Text } from "react-native";
import { lightenColor } from "../../utils/Utils";

export default function ActivitiesContainer({ userHabits }: any) {
	const { theme } = useContext(ThemeContext);

	const blueSoft = lightenColor("#08209F", 0.05);

	return (
		<View
			className="mt-8 py-4 mb-5 pb-10 rounded-xl ml-3 z-[1000]"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Text
				className="text-lg mb-3 w-10/12 mx-auto font-semibold"
				style={{
					color: theme.colors.text,
				}}
			>
				Mes activités
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
