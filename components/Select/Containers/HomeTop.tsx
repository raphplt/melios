import ButtonClose from "@components/Shared/ButtonClose";
import { useTheme } from "@context/ThemeContext";
import { View, StatusBar } from "react-native";
import HabitsType from "./HabitsType";

import ButtonNewHabit from "../Items/ButtonNewHabit";

export default function HomeTop() {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: StatusBar.currentHeight,
			}}
		>
			<ButtonClose />
			<HabitsType />
			<ButtonNewHabit />
		</View>
	);
}
