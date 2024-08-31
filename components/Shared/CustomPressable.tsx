import { ThemeContext } from "@context/ThemeContext";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

export default function CustomPressable({
	text,
	onPress,
	bgColor,
	textColor,
}: {
	text: string;
	onPress: () => void;
	bgColor?: string;
	textColor?: string;
}) {
	const { theme } = useContext(ThemeContext);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handleTouchStart = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleTouchEnd = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
		>
			<Pressable
				className="rounded-3xl px-8 py-3"
				onPress={onPress}
				style={{
					backgroundColor: bgColor || theme.colors.cardBackground,
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				<Text
					className="font-bold text-[16px]"
					style={{
						color: textColor || theme.colors.text,
					}}
				>
					{text}
				</Text>
			</Pressable>
		</Animated.View>
	);
}
