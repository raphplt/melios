import { ActivityIndicator, Animated, Pressable, Text } from "react-native";
import { useRef, useState } from "react";
import { useTheme } from "@context/ThemeContext";

export default function ButtonLogin({
	login,
	isDisabled,
}: {
	login: () => void;
	isDisabled: boolean;
}) {
	const [isPressed, setIsPressed] = useState(false);
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { theme } = useTheme();

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

	const onPressIn = () => {
		setIsPressed(true);
		login();
	};

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
			className="w-full"
		>
			<Pressable
				onPress={onPressIn}
				disabled={isDisabled}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
				style={{
					backgroundColor: isDisabled
						? theme.colors.grayPrimary
						: theme.colors.primary,
				}}
				className="w-full mx-auto py-3 rounded-3xl focus:bg-blue-800 mt-6 flex items-center"
			>
				{isPressed ? (
					<ActivityIndicator size="small" color={"#F8F9FF"} />
				) : (
					<Text
						style={{ color: "#F8F9FF" }}
						className="text-[18px] text-center font-semibold"
					>
						Se connecter
					</Text>
				)}
			</Pressable>
		</Animated.View>
	);
}
