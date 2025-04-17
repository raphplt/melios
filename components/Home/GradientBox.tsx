import useIndex from "@hooks/useIndex";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
	colors?: [string, string, ...string[]];
	position: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	children: React.ReactNode;
};

const GradientBox = ({ colors, position, children }: Props) => {
	const { isDayTime } = useIndex();

	const colorsSafe: [string, string, ...string[]] =
		colors ||
		(isDayTime
			? ["#fdf6e3", "#ffe9b5", "#fff5dd"]
			: ["#1f1b2e", "#3a2f58", "#1a1a1a"]);

	return (
		<View style={[position, styles.container]}>
			<LinearGradient
				colors={colorsSafe}
				style={styles.gradientBorder}
				start={{ x: 0.1, y: 0.1 }}
				end={{ x: 0.9, y: 0.9 }}
			>
				<View style={styles.innerContainer}>
					<BlurView
						intensity={90}
						style={styles.blurView}
						tint={isDayTime ? "light" : "dark"}
					/>
					<View style={styles.glowOverlay} />
					{children}
				</View>
			</LinearGradient>
		</View>
	);
};

export default GradientBox;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		zIndex: 30,
	},
	gradientBorder: {
		borderRadius: 20,
		padding: 2,
		shadowColor: "#FFD700",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
	},
	innerContainer: {
		borderRadius: 18,
		overflow: "hidden",
		backgroundColor: "rgba(255,255,255,0.1)",
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
	},
	glowOverlay: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 18,
		backgroundColor: "rgba(255, 223, 0, 0.08)",
	},
});
