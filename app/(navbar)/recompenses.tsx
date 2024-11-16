import { View } from "react-native";
import { useTheme } from "@context/ThemeContext";

import { SafeAreaView } from "react-native-safe-area-context";
import MarketPacks from "@components/Recompenses/MarketPacks";
import CosmeticPreview from "@components/Recompenses/CosmeticPreview";
import { StatusBar } from "react-native";
import { Platform } from "react-native";

export default function Recompenses() {
	const { theme } = useTheme();

	const statusBarHeight =
		Platform.OS === "android" ? StatusBar.currentHeight : 0;

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<CosmeticPreview />
			<MarketPacks />
		</View>
	);
}
