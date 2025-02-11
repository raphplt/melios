import { LinearGradient } from "expo-linear-gradient";
import { View, Dimensions } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

export default function GoalPlaceHolder() {
	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

	const screenWidth = Math.round(Dimensions.get("screen").width);

	return (
		<View className="w-full flex flex-row items-center mx-auto justify-center my-[6px]">
			<ShimmerPlaceholder
				width={screenWidth * 0.95}
				height={60}
				style={{
					borderRadius: 10,
				}}
			/>
		</View>
	);
}
