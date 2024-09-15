import { Text, View } from "react-native";
import { useContext } from "react";

import ViewPoints from "@components/Recompenses/ViewPoints";
import { ThemeContext } from "@context/ThemeContext";
import MarketCosmetics from "@components/Recompenses/MarketCosmetics";
import AlertBanner from "@components/Recompenses/AlertBanner";
import { useTabBarPadding } from "@hooks/useTabBar";

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
			}}
		>
			<View
				className="flex flex-row justify-between items-center my-3 mx-auto rounded-lg py-4 px-3 w-11/12"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<Text
					className="text-center text-lg"
					style={{
						color: theme.colors.textSecondary,
					}}
				>
					Mes points
				</Text>
				<ViewPoints />
			</View>
			<MarketCosmetics />
		</View>
	);
}