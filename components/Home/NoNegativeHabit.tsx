import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function NoNegativeHabits() {
	const { theme } = useTheme();
	const { width } = Dimensions.get("window");
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { t } = useTranslation();

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
		<View className="flex flex-col py-5 items-center justify-center">
			<CachedImage
				imagePath="images/illustrations/character2.png"
				style={{
					width: width * 0.4,
					height: width * 0.4,
					marginVertical: 16,
					resizeMode: "contain",
				}}
			/>

			<Text
				style={{ color: theme.colors.textTertiary }}
				className="text-center mt-6 w-10/12 mx-auto"
			>
				{t("no_negative_habits")}
			</Text>
			<Animated.View
				style={{
					transform: [{ scale: scaleAnim }],
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				<Pressable
					className="w-10/12 rounded-3xl py-3 px-4 mt-6 flex flex-row items-center justify-between"
					style={{
						backgroundColor: theme.colors.primary,
					}}
					onPress={() => navigation.navigate("(select)")}
				>
					<Text
						style={{
							color: "#fff",
						}}
						className="text-center text-lg font-semibold ml-4"
					>
						{t("add_negative_habit")}
					</Text>
					<View className="mr-4">
						<Iconify icon="material-symbols:add" size={20} color="#fff" />
					</View>
				</Pressable>
			</Animated.View>
		</View>
	);
}
