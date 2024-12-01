import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { SafeAreaView, Platform, StatusBar } from "react-native";

const cosmeticShop = () => {
	const { theme } = useTheme();
	// const statusBarHeight =
	// 	Platform.OS === "android" ? StatusBar.currentHeight : 0;

	return (
		<SafeAreaView
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<MarketCosmetics />
		</SafeAreaView>
	);
};

export default cosmeticShop;
