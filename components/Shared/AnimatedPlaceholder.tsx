import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleProp } from "react-native";

export interface AnimatedPlaceholderProps {
	style?: StyleProp<ViewStyle>;
	width?: number;
	height?: number;
	marginRight?: number;
	backgroundColor?: string;
	borderRadius?: number;
	animationDuration?: number;
	initialOpacity?: number;
	finalOpacity?: number;
	// Vous pouvez ajouter d'autres props si nécessaire
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({
	style,
	width = 32,
	height = 32,
	marginRight = 0,
	backgroundColor = "#ccc",
	borderRadius = 16,
	animationDuration = 500,
	initialOpacity = 0.3,
	finalOpacity = 1,
	...rest
}) => {
	const opacity = useRef(new Animated.Value(initialOpacity)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: finalOpacity,
					duration: animationDuration,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: initialOpacity,
					duration: animationDuration,
					useNativeDriver: true,
				}),
			])
		).start();
	}, [opacity, animationDuration, initialOpacity, finalOpacity]);

	const defaultStyle: ViewStyle = {
		opacity,
		width,
		height,
		marginRight,
		backgroundColor,
		borderRadius,
	};

	return <Animated.View {...rest} style={[defaultStyle, style]} />;
};

export default AnimatedPlaceholder;
