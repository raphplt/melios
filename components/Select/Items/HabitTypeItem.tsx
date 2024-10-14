import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { ReactNode, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

export default function HabitTypeBox({
	icon,
	name,
	bgColor,
	bgColorSelected,
	typeHabit,
	onPress,
}: {
	icon: ReactNode;
	name: string;
	bgColor?: string;
	bgColorSelected?: string;
	typeHabit: string;
	onPress?: () => void;
}) {
	const { theme } = useTheme();
	const { type } = useSelect();
	const backgroundColor = useSharedValue(theme.colors.cardBackground);
	const borderColor = useSharedValue(theme.colors.border);
	const textColor = useSharedValue(theme.colors.text);

	useEffect(() => {
		if (type === typeHabit) {
			backgroundColor.value = withTiming(
				bgColorSelected || theme.colors.cardBackground,
				{ duration: 300 }
			);
			borderColor.value = withTiming(bgColorSelected || theme.colors.border, {
				duration: 300,
			});
			textColor.value = withTiming("#fff", { duration: 300 });
		} else {
			backgroundColor.value = withTiming(theme.colors.cardBackground, {
				duration: 300,
			});
			borderColor.value = withTiming(theme.colors.border, { duration: 300 });
			textColor.value = withTiming(theme.colors.text, { duration: 300 });
		}
	}, [type]);

	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: backgroundColor.value,
		borderColor: borderColor.value,
	}));

	const animatedTextStyle = useAnimatedStyle(() => ({
		color: textColor.value,
	}));

	return (
		<Animated.View
			style={[animatedStyle, { borderWidth: 2 }]}
			className="w-[45%] rounded-xl mx-2"
		>
			<Pressable
				onPress={onPress}
				className="flex flex-col items-center justify-center w-full h-full p-4"
				style={{
					flex: 1,
				}}
			>
				{icon}
				<Animated.Text
					className="text-[16px] text-center pt-3 font-semibold"
					style={animatedTextStyle}
				>
					{name}
				</Animated.Text>
			</Pressable>
		</Animated.View>
	);
}