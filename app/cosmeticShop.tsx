import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { SafeAreaView } from "react-native";

const cosmeticShop = () => {
	const { theme } = useTheme();

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
