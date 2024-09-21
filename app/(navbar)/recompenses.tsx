import { StatusBar, Text, View } from "react-native";
import { useContext } from "react";

import ViewPoints from "@components/Recompenses/ViewPoints";
import { ThemeContext } from "@context/ThemeContext";
import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import AlertBanner from "@components/Recompenses/AlertBanner";
import { useTabBarPadding } from "@hooks/useTabBar";
import PointsBox from "@components/Recompenses/PointsBox";

export default function Recompenses() {
	const { theme } = useContext(ThemeContext);
	const paddingBottom = useTabBarPadding();

	return (
		<View
			className=""
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
