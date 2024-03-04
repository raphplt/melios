import { View, Text } from "react-native";
import { DateButton } from "./DateButton";

export const NavHeader = ({ onPress, theme }: any) => {
	return (
		<View
			className="flex mt-3 items-center mx-auto justify-between flex-row"
			style={{ backgroundColor: theme.colors.background }}
		>
			<DateButton date="Jour" theme={theme} onPress={onPress("Jour")} />
			<DateButton date="Semaine" theme={theme} onPress={onPress("Semaine")} />
			<DateButton date="Mois" theme={theme} onPress={onPress("Mois")} />
			<DateButton date="Année" theme={theme} onPress={onPress("Année")} />
		</View>
	);
};
