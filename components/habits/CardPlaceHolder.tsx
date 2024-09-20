import { LinearGradient } from "expo-linear-gradient";
import { View, Dimensions } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

export default function CardPlaceHolder() {
	const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

	const screenWidth = Math.round(Dimensions.get("screen").width);

	return (
		<View className="w-[90%] flex flex-row items-center mx-auto justify-center my-[6px]">
			<ShimmerPlaceholder
				width={30}
				height={30}
				style={{
					borderRadius: 10,
				}}
			/>

			<ShimmerPlaceholder
				width={screenWidth * 0.8}
				height={40}
				style={{
					borderRadius: 10,
					marginLeft: 10,
				}}
			/>
		</View>
	);
}
