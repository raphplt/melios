import React, { useEffect, useRef } from "react";
import {
	Text,
	View,
	Animated,
	Dimensions,
	Modal,
	Pressable,
} from "react-native";
import { CombinedLevel } from "@type/levels";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { LinearGradient } from "expo-linear-gradient";
import BadgeLevel from "@components/Svg/Level";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor, lightenColorHex } from "@utils/colors";
import ZoomableView from "@components/Shared/ZoomableView";

type Props = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	levelData: CombinedLevel | null;
};

const NextLevel = ({ visible, setVisible, levelData }: Props) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const animatedProgress = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(animatedProgress, {
					toValue: 100,
					duration: 1500,
					useNativeDriver: false,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			]).start(() => {});
		} else {
			Animated.parallel([
				Animated.timing(animatedProgress, {
					toValue: 0,
					duration: 500,
					useNativeDriver: false,
				}),
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 0.8,
					duration: 500,
					useNativeDriver: true,
				}),
			]).start(() => {});
		}
	}, [visible]);

	if (!levelData) return null;

	const lightHex = lightenColorHex(levelData.color);

	return (
		<Modal
			visible={visible}
			transparent={false}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
			statusBarTranslucent={true}
			className="w-screen h-screen"
		>
			<Animated.View
				style={{
					flex: 1,
					opacity: fadeAnim,
					transform: [{ scale: scaleAnim }],
				}}
			>
				<LinearGradient
					style={{
						paddingTop: 40,
						height: Dimensions.get("screen").height,
						padding: 10,
						margin: "auto",
						width: "100%",
					}}
					start={[0, 0]}
					colors={[
						lightenColor(levelData.color, 0.4) || theme.colors.yellowSecondary,
						theme.colors.background,
						lightenColor(levelData.color, 0.4) || theme.colors.yellowSecondary,
					]}
				>
					<View className="flex flex-col items-center justify-center w-full h-full">
						<BadgeLevel
							level={levelData.currentLevel ?? 1}
							color1={levelData.color}
							color2={lightHex}
						/>
						<Text className="text-2xl font-bold mt-4">
							{t("level_up").toUpperCase()}!
						</Text>

						<View className="flex flex-row justify-evenly w-full mt-10">
							{/* Partie gauche */}
							<View className="flex flex-col justify-between items-center">
								<View className="flex flex-col items-center">
									<MoneyMelios width={40} height={40} />
									<Text className="font-semibold text-lg mt-2">
										+{levelData.currentLevel + 2}
									</Text>
									<Text className="text-sm text-gray-700">{t("points_earned")}</Text>
								</View>
							</View>

							{/* Partie droite */}
							<View className="flex flex-col items-center">
								<FontAwesome6
									name={levelData.icon}
									size={40}
									color={levelData.color ?? theme.colors.primary}
								/>
								<Text className="font-semibold text-lg mt-2">{t(levelData.slug)}</Text>
								<Text className="text-sm text-gray-700">{t("category")}</Text>
							</View>
						</View>

						<View className="mt-24 w-full mx-auto">
							<ZoomableView>
								<Pressable
									className="w-[95%] mx-auto p-4 rounded-xl flex items-center justify-center"
									style={{
										backgroundColor: theme.colors.primary,
									}}
									onPress={() => {
										setVisible(false);
									}}
								>
									<Text
										style={{
											color: theme.colors.textSecondary,
										}}
										className="text-xl font-semibold"
									>
										{t("continue")}
									</Text>
								</Pressable>
							</ZoomableView>
						</View>
					</View>
				</LinearGradient>
			</Animated.View>
		</Modal>
	);
};

export default NextLevel;
