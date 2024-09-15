import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function AlertBanner() {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="w-11/12 mx-auto rounded-lg py-3 flex flex-row items-center justify-evenly"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<Iconify
				icon="mdi:alert-circle-outline"
				size={28}
				color={theme.colors.primary}
			/>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="font-semibold w-10/12 text-[16px"
			>
				Les récompenses ne sont pas encore disponibles. Revenez bientôt !
			</Text>
		</View>
	);
}
