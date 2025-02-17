import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CategoryTypeSelect } from "@utils/category.type";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "react-native";
import { Pressable } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

export default function HabitTypeBox({
	icon,
	name,
	bgColorSelected,
	typeHabit,
	onPress,
}: {
	icon: ReactNode;
	name: string;
	bgColorSelected?: string;
	typeHabit: string;
	onPress?: () => void;
}) {
	const { theme } = useTheme();
	const { type } = useSelect();
	const backgroundColor = useSharedValue(theme.colors.cardBackground);
	const borderColor = useSharedValue(theme.colors.border);
	const textColor = useSharedValue(theme.colors.text);
	const [haveSeenNegative, setHaveSeenNegative] = useState(false);
	const [haveSeenRoutine, setHaveSeenRoutine] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchLocalNew = async () => {
			const newHabitNegative = await AsyncStorage.getItem("haveSeenNegative");
			if (newHabitNegative) {
				setHaveSeenNegative(true);
			}
			const newHabitRoutine = await AsyncStorage.getItem("haveSeenRoutine");
			if (newHabitRoutine) {
				setHaveSeenRoutine(true);
			}
		};
		fetchLocalNew();
	}, []);

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

	const handlePress = () => {
		if (typeHabit === CategoryTypeSelect.negative) {
			AsyncStorage.setItem("haveSeenNegative", "true");
			setHaveSeenNegative(true);
		}
		if (typeHabit === CategoryTypeSelect.routine) {
			AsyncStorage.setItem("haveSeenRoutine", "true");
			setHaveSeenRoutine(true);
		}
		if (onPress) {
			onPress();
		}
	};

	return (
		<Animated.View style={[animatedStyle]} className="w-[30%] rounded-xl">
			{/* Temp */}
			{/* {!haveSeenNegative && typeHabit === CategoryTypeSelect.negative && (
				<View
					className="absolute top-1 right-1 px-2 py-1 rounded-xl"
					style={{
						backgroundColor: theme.colors.redPrimary,
					}}
				>
					<Text className="text-white text-xs font-semibold">{t("new")}</Text>
				</View>
			)} */}
			{!haveSeenRoutine && typeHabit === CategoryTypeSelect.routine && (
				<View
					className="absolute top-1 right-1 px-2 py-1 rounded-xl"
					style={{
						backgroundColor: theme.colors.redPrimary,
					}}
				>
					<Text className="text-white text-xs font-semibold">{t("new")}</Text>
				</View>
			)}
			<Pressable
				onPress={handlePress}
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