import ButtonClose from "@components/Shared/ButtonClose";
import { useTheme } from "@context/ThemeContext";
import { View, StatusBar, Platform } from "react-native";
import HabitsType from "./HabitsType";

import ButtonNewHabit from "../Items/ButtonNewHabit";

export default function HomeTop() {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
			}}
		>
			<ButtonClose />
			<HabitsType />
			<ButtonNewHabit />
		</View>
	);
}
