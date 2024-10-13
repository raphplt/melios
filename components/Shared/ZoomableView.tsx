import React, { useRef } from "react";
import { Animated, ViewProps, GestureResponderEvent } from "react-native";

interface ZoomableViewProps extends ViewProps {
	children: React.ReactNode;
}

const ZoomableView: React.FC<ZoomableViewProps> = ({
	children,
	style,
	...props
}) => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handleTouchStart = (e: GestureResponderEvent) => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
		props.onTouchStart?.(e);
	};

	const handleTouchEnd = (e: GestureResponderEvent) => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
		props.onTouchEnd?.(e);
	};

	return (
		<Animated.View
			style={[style, { transform: [{ scale: scaleAnim }] }]}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchEnd}
			{...props}
		>
			{children}
		</Animated.View>
	);
};

export default ZoomableView;
