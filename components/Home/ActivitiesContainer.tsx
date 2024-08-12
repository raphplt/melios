import { useContext } from "react";
import Activity from "./ActivityCard";
import { ThemeContext } from "../../context/ThemeContext";
import { ScrollView, View, Text } from "react-native";

export default function ActivitiesContainer({ userHabits }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="mt-8 py-4 mb-5 pb-10 rounded-xl ml-3 z-[1000]"
			style={{
				backgroundColor: theme.colors.backgroundSecondary,
			}}
		>
			<Text
				className="text-[16px] mb-3 w-11/12 mx-auto italic font-semibold"
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
