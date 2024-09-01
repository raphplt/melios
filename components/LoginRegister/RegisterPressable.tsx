import { ThemeContext } from "@context/ThemeContext";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export default function RegisterPressable({
	text,
	onPress,
	icon,
	selected,
}: {
	text: string;
	onPress: () => void;
	icon?: React.ReactNode;
	selected?: boolean;
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
				className=" w-full rounded-3xl px-6 py-3 flex flex-row items-center justify-start x mx-auto my-2"
				onPress={onPress}
				style={{
					backgroundColor: selected
						? theme.colors.backgroundTertiary
						: theme.colors.cardBackground,
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				<View className="flex flex-row items-center">
					{icon}

					<Text
						className="font-bold text-[16px] ml-3"
						style={{
							color: theme.colors.text,
						}}
					>
						{text}
					</Text>
				</View>
			</Pressable>
		</Animated.View>
	);
}
