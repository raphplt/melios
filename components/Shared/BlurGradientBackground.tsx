import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import useIndex from "@hooks/useIndex";

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
	const { isDayTime } = useIndex();
	const colorTop = isDayTime ? "rgba(255,255,255,0)" : "rgba(0, 0, 0, 0)";
	const colors = gradientColors || ["rgba(8, 32, 159, 0.7)", colorTop];

	return (
		<View style={[styles.container, style]}>
			<BlurView intensity={intensity} tint={tint} style={styles.blurView}>
				<LinearGradient
					colors={colors}
					start={{ x: 0.5, y: 1 }}
					end={{ x: 0.5, y: 0 }}
					style={StyleSheet.absoluteFill}
				/>
			</BlurView>
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