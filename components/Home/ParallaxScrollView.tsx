import React, { type PropsWithChildren, type ReactElement } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import BlurBox from "./ParallaxBlurBox";
import { useTabBarPadding } from "@hooks/useTabBar";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { Iconify } from "react-native-iconify";
import WelcomeRow from "./WelcomeRow";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import MissionButton from "./MissionButton";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	refreshControl?: ReactElement;
}>;

export default function ParallaxScrollView({
	children,
	refreshControl,
}: Props) {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { theme } = useTheme();
	const { isDayTime, imageTemple } = useIndex();
	const { streak } = useData();
	const { t } = useTranslation();

	const paddingBottom = useTabBarPadding();

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	}, [scrollOffset]);

	const { usersLevels } = useData();

	const color = isDayTime ? "black" : "white";

	const streakUpdatedToday =
		streak?.updatedAt &&
		new Date(streak.updatedAt).toDateString() === new Date().toDateString();

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any];

	const xpPercentage = globalLevel
		? (globalLevel.currentXp / globalLevel.nextLevelXp) * 100
		: 0;

	return (
		<>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				refreshControl={refreshControl}
			>
				<Animated.View
					style={[{ backgroundColor: theme.colors.background }, headerAnimatedStyle]}
				>
					<BlurBox position={{ top: 20, left: 20 }}>
						<WelcomeRow />
					</BlurBox>

					<BlurBox position={{ top: 20, right: 20 }} intensity={100}>
						<View className="flex items-center justify-center flex-row ">
							<Progress.Circle
								size={32}
								progress={xpPercentage / 100}
								color={isDayTime ? theme.colors.primary : theme.colors.tertiary}
								unfilledColor={theme.colors.card}
								borderWidth={0}
								thickness={4}
							/>
							<Text
								style={{
									fontSize: 14,
									color: isDayTime ? theme.colors.primary : theme.colors.tertiary,
								}}
								className="font-bold absolute text-lg"
							>
								{globalLevel?.currentLevel || "1"}
							</Text>
						</View>
					</BlurBox>
					<BlurBox position={{ bottom: 20, left: 20 }} intensity={100}>
						<View className="flex flex-row items-center gap-2">
							<Iconify
								icon="mdi:calendar"
								color={streakUpdatedToday ? theme.colors.primary : color}
								size={20}
							/>
							<Text
								className="font-semibold text-[14px]"
								style={{
									color: streakUpdatedToday ? theme.colors.primary : color,
								}}
							>
								{t("streak")} : {streak?.value}{" "}
								{streak && streak?.value > 1 ? t("days") : t("day")}
							</Text>
						</View>
					</BlurBox>
					<MissionButton />

					{imageTemple ? (
						<Image
							source={{ uri: imageTemple }}
							style={{ width: "100%", height: 220, resizeMode: "cover" }}
							className="rounded-b-md"
						/>
					) : (
						<View
							style={{
								width: "100%",
								height: 220,
								backgroundColor: theme.colors.backgroundSecondary,
								justifyContent: "center",
								alignItems: "center",
							}}
						/>
					)}
				</Animated.View>
				<View
					style={{
						backgroundColor: theme.colors.background,
						paddingBottom: paddingBottom,
					}}
				>
					{children}
				</View>
			</Animated.ScrollView>
		</>
	);
}
