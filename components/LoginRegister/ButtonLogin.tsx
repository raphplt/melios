import { Animated, Pressable, Text } from "react-native";
import { useRef } from "react";

export default function ButtonLogin({
	login,
	isDisabled,
	theme,
}: {
	login: () => void;
	isDisabled: boolean;
	theme: any;
}) {
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
			className="w-full"
		>
			<Pressable
				onPress={login}
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
				<Text
					style={{ color: "#F8F9FF" }}
					className="text-[18px] text-center font-semibold"
				>
					Se connecter
				</Text>
			</Pressable>
		</Animated.View>
	);
}
