import { StatusBar, Platform } from "react-native";
import { useTheme } from "@context/ThemeContext";

import { SafeAreaView } from "react-native-safe-area-context";
import MarketPacks from "@components/Recompenses/MarketPacks";
import CosmeticPreview from "@components/Recompenses/CosmeticPreview";

export default function Recompenses() {
	const { theme } = useTheme();

	const statusBarHeight =
		Platform.OS === "android" ? StatusBar.currentHeight : 0;

	return (
		<SafeAreaView
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
				paddingTop: statusBarHeight,
			}}
		>
			<CosmeticPreview />
			<MarketPacks />
		</SafeAreaView>
	);
}
