import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View, Animated } from "react-native";
import { Iconify } from "react-native-iconify";
import GradientBox from "./GradientBox";
import { useData } from "@context/DataContext";

const MissionButton = () => {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { t } = useTranslation();
	const { isDayTime } = useIndex();
	const { hasUnvalidatedCompletedTasks, canClaimReward } = useData();

	const showNotification = hasUnvalidatedCompletedTasks || canClaimReward;

	const opacityAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (showNotification) {
			const blinkAnimation = Animated.loop(
				Animated.sequence([
					Animated.timing(opacityAnim, {
						toValue: 0.3,
						duration: 800,
						useNativeDriver: true,
					}),
					Animated.timing(opacityAnim, {
						toValue: 1,
						duration: 800,
						useNativeDriver: true,
					}),
				])
			);

			blinkAnimation.start();

			return () => {
				blinkAnimation.stop();
			};
		}
	}, [showNotification]);

	return (
		<GradientBox
			position={{ top: 20, right: 20 }}
			colors={[theme.colors.purplePrimary, theme.colors.backgroundTertiary]}
		>
			<View className="flex flex-row items-center gap-2 relative">
				<Pressable
					className="flex flex-row items-center justify-center px-4 py-[10px]"
					onPress={() => navigation.navigate("dailyRewards")}
				>
					<Iconify
						icon="material-symbols:target"
						color={isDayTime ? theme.colors.primary : "white"}
						size={20}
					/>
					<Text
						style={{ color: isDayTime ? theme.colors.primary : "white" }}
						className="text-[14px] font-semibold ml-2"
					>
						{t("missions")}
					</Text>

					{showNotification && (
						<Animated.View
							style={{
								position: "absolute",
								top: 2,
								right: 2,
								width: 10,
								height: 10,
								borderRadius: 5,
								backgroundColor: canClaimReward
									? theme.colors.greenPrimary
									: theme.colors.redPrimary,
								opacity: opacityAnim,
							}}
						/>
					)}
				</Pressable>
			</View>
		</GradientBox>
	);
};

export default MissionButton;