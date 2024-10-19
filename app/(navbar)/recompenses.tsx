import { StatusBar, Platform } from "react-native";
import { useTheme } from "@context/ThemeContext";
import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import { useTabBarPadding } from "@hooks/useTabBar";
import PointsBox from "@components/Recompenses/PointsBox";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recompenses() {
	const { theme } = useTheme();
	const paddingBottom = useTabBarPadding();

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
			<PointsBox />
			<MarketCosmetics />
		</SafeAreaView>
	);
}
