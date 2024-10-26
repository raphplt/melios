import { ThemeContext } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { useContext, useState, useEffect } from "react";
import { Animated, Text } from "react-native";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import {
	useAnimatedStyle,
	withTiming,
	useSharedValue,
} from "react-native-reanimated";

export default function ButtonBack() {
	const { theme } = useContext(ThemeContext);
	const [menuVisible, setMenuVisible] = useState(false);
	const opacity = useSharedValue(0);
	const translateY = useSharedValue(-10);
	const { rotate } = useIndex();

	useEffect(() => {
		if (menuVisible) {
			opacity.value = withTiming(1, { duration: 200 });
			translateY.value = withTiming(0, { duration: 200 });
		} else {
			opacity.value = withTiming(0, { duration: 200 });
			translateY.value = withTiming(-10, { duration: 200 });
		}
	}, [menuVisible]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateY: translateY.value }],
		};
	});

	const buttonStyle =
		"py-3 my-2 px-10 rounded-md w-full flex flex-row items-center justify-center";

	return (
		<>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Pressable onPress={() => setMenuVisible(!menuVisible)} className="flex">
					<Iconify
						icon="material-symbols:settings"
						size={24}
						color={theme.colors.textTertiary}
					/>
				</Pressable>
			</Animated.View>
			{menuVisible && (
				<Animated.View
					className="z-20 absolute top-12 right-2 bg-white rounded-md shadow-lg p-2 px-3"
					style={[
						{
							backgroundColor: theme.colors.background,
						},
						animatedStyle,
					]}
				>
					<Pressable
						className={buttonStyle}
						style={{
							backgroundColor: theme.colors.greenSecondary,
						}}
						onPress={() => {
							/* Action pour éditer */
						}}
					>
						<Iconify icon="mdi:pencil" size={24} color={theme.colors.text} />
						<Text
							style={{ color: theme.colors.text }}
							className="font-semibold text-center text-[16px] px-2"
						>
							Éditer
						</Text>
					</Pressable>
					<Pressable
						className={buttonStyle}
						style={{
							backgroundColor: theme.colors.redSecondary,
						}}
						onPress={() => {
							/* Action pour supprimer */
						}}
					>
						<Iconify icon="mdi:trash-can" size={24} color={theme.colors.text} />
						<Text
							style={{ color: theme.colors.text }}
							className="font-semibold text-center text-[16px]"
						>
							Supprimer
						</Text>
					</Pressable>
				</Animated.View>
			)}
		</>
	);
}