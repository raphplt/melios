import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface BlurBoxProps {
	position: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	children: React.ReactNode;
}

const BlurBox: React.FC<BlurBoxProps> = ({ position, children }) => {
	return (
		<View style={[styles.container, position]}>
			<BlurView intensity={70} style={styles.blurView} />
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		zIndex: 30,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		overflow: "hidden",
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});

export default BlurBox;
