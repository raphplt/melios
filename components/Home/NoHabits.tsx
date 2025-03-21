import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Dimensions,
	Image,
	Pressable,
	Text,
	View,
} from "react-native";
import { Iconify } from "react-native-iconify";

export default function NoHabits() {
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
		<View className="flex flex-col py-12 items-center justify-center">
			<CachedImage
				imagePath="images/illustrations/not_found.png"
				style={{
					width: width * 0.5,
					height: width * 0.5,
					marginVertical: 16,
					resizeMode: "contain",
				}}
			/>

			<Text
				style={{ color: theme.colors.textTertiary }}
				className="text-center mt-6"
			>
				{t("no_habits_add_one")}
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
					className="w-10/12 rounded-3xl py-3 px-4 mt-6 flex flex-row items-center justify-center"
					style={{
						backgroundColor: theme.colors.primary,
					}}
					onPress={() => navigation.navigate("(select)")}
				>
					<Text
						style={{
							color: "#fff",
						}}
						className="text-center text-lg font-semibold mr-2"
					>
						{t("i_create_my_first_habit")}
					</Text>
					<Iconify icon="material-symbols:add" size={20} color="#fff" />
				</Pressable>
			</Animated.View>
		</View>
	);
}
