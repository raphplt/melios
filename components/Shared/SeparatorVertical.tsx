import React from "react";
import { View, ViewStyle } from "react-native";

interface SeparatorVerticalProps {
	color?: string;
	width?: number;
	style?: ViewStyle;
}

const SeparatorVertical: React.FC<SeparatorVerticalProps> = ({
	color = "gray",
	width = 1,
	style,
}) => {
	return (
		<View
			style={[
				{
					backgroundColor: color,
					width: width,
					height: "100%",
				},
				style,
			]}
		/>
	);
};

export default SeparatorVertical;
