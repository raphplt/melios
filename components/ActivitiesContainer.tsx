import { useContext } from "react";
import Activity from "./Activity";
import { ThemeContext } from "./ThemContext";
import { ScrollView, View } from "react-native";

export default function ActivitiesContainer() {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="mt-6">
			<ScrollView
				horizontal={true}
				// className="flex flex-row justify-between"
				style={{
					backgroundColor: theme.colors.background,
				}}
			>
				<Activity />
				<Activity />
				<Activity />
				<Activity />
				<Activity />
				<Activity />
			</ScrollView>
		</View>
	);
}
