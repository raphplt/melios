import React from "react";
import { Text, View } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const PlaceHolder = ({ isFetched }) => (
	<View>
		<ShimmerPlaceholder />
		<ShimmerPlaceholder visible={isFetched}>
			<Text>Wow, awesome here.</Text>
		</ShimmerPlaceholder>
	</View>
);

export default PlaceHolder;
