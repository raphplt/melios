import { useTheme } from "@context/ThemeContext";
import React from "react";
import { View, ViewStyle } from "react-native";

interface SeparatorVerticalProps {
	width?: number;
	style?: ViewStyle;
}

const SeparatorVertical: React.FC<SeparatorVerticalProps> = ({
	width = 1,
	style,
}) => {
	const { theme } = useTheme();
	return (
		<View
			style={[
				{
					backgroundColor: theme.colors.border,
					width: width,
					height: "100%",
				},
				style,
			]}
		/>
	);
};

export default SeparatorVertical;
