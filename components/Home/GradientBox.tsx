import useIndex from "@hooks/useIndex";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ZoomableView from "@components/Shared/ZoomableView";

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
		colors || (isDayTime ? ["#f5f5f5", "#f5f5f5"] : ["#1a1a1a", "#1a1a1a"]);

	return (
		<View style={[position, styles.container]}>
			<ZoomableView>
				<LinearGradient colors={colorsSafe} style={styles.gradientBorder}>
					<View style={styles.innerContainer}>
						<BlurView
							intensity={100}
							style={styles.blurView}
							tint={isDayTime ? "extraLight" : "dark"}
						/>
						{children}
					</View>
				</LinearGradient>
			</ZoomableView>
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
		borderRadius: 10,
		// padding: 1,
	},
	innerContainer: {
		borderRadius: 10,
		overflow: "hidden",
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
	},
	pressable: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	text: {
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 8,
	},
});