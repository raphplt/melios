import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { ThemeContext } from "@context/ThemeContext";
import getIcon from "@utils/cosmeticsUtils";
import { useContext } from "react";
import { Dimensions, View, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function CosmeticPlaceHolder() {
	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
	const { theme } = useContext(ThemeContext);
	const screenWidth = Math.round(Dimensions.get("screen").width);

	return (
		<View
			className="flex flex-col items-center w-[31%] mx-auto my-1 py-2 rounded-xl"
			style={{
				borderColor: theme.colors.cardBackground,
				borderWidth: 1,
			}}
		>
			<ShimmerPlaceholder
				width={screenWidth * 0.3}
				height={160}
				style={{
					borderRadius: 10,
				}}
			></ShimmerPlaceholder>
		</View>
	);
}
