import { useTheme } from "@context/ThemeContext";
import { Dimensions, View } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function CosmeticPlaceHolder() {
	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
	const { theme } = useTheme();
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
