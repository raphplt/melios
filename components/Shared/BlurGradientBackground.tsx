import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";

interface BlurGradientBackgroundProps {
	intensity?: number;
	tint?: "light" | "dark" | "default";
	gradientColors?: string[];
	style?: ViewStyle;
}

const BlurGradientBackground: React.FC<BlurGradientBackgroundProps> = ({
	intensity = 50,
	tint = "default",
	gradientColors,
	style,
}) => {
	const { theme } = useTheme();
	const colorTop = theme.dark ? "transparent" : "rgba(0, 0, 0, 0)";
	const colors = gradientColors || ["rgb(78, 78, 80)", colorTop];

	return (
		<View style={[styles.container, style]}>
			<LinearGradient
				colors={colors}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={StyleSheet.absoluteFill}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		overflow: "hidden",
		backgroundColor: "transparent",
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
	},
});

export default BlurGradientBackground;