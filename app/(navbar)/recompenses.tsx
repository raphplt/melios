import { StatusBar, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import { useTabBarPadding } from "@hooks/useTabBar";
import PointsBox from "@components/Recompenses/PointsBox";

export default function Recompenses() {
	const { theme } = useContext(ThemeContext);
	const paddingBottom = useTabBarPadding();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
				paddingBottom: paddingBottom + 10,
				paddingTop: StatusBar.currentHeight,
			}}
		>
			<PointsBox />
			<MarketCosmetics />
		</View>
	);
}
