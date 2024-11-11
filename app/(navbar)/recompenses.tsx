import { View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import MarketCosmetics from "@components/Recompenses/MarketCosmetics";

export default function Recompenses() {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<MarketCosmetics />
		</View>
	);
}
