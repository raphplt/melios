import React, { type PropsWithChildren, type ReactElement } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import BlurBox from "./ParallaxBlurBox";
import { useTabBarPadding } from "@hooks/useTabBar";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { Iconify } from "react-native-iconify";
import WelcomeRow from "./WelcomeRow";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";

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

					<View
						style={{
							top: 15,
							right: 5,
						}}
						className="absolute z-30 py-2  overflow-hidden"
					>
						<View className="flex items-center justify-center flex-row px-2 mx-2 rounded-l-full">
							<View className="flex items-center justify-center">
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
									className="font-bold absolute"
								>
									{globalLevel?.currentLevel || "1"}
								</Text>
							</View>
						</View>
					</View>
					<BlurBox position={{ bottom: 20, left: 20 }}>
						<View className="flex flex-row items-center gap-2">
							<Iconify
								icon="mdi:calendar"
								color={
									streakUpdatedToday
										? isDayTime
											? theme.colors.purplePrimary
											: theme.colors.purpleSecondary
										: color
								}
								size={18}
							/>
							<Text
								className="font-semibold text-[14px]"
								style={{
									color: streakUpdatedToday
										? isDayTime
											? theme.colors.purplePrimary
											: theme.colors.purpleSecondary
										: color,
								}}
							>
								{t("streak")} : {streak?.value}{" "}
								{streak && streak?.value > 1 ? t("days") : t("day")}
							</Text>
						</View>
					</BlurBox>

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
