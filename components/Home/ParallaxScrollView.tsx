import React, { type PropsWithChildren, type ReactElement } from "react";
import { Image, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { useTabBarPadding } from "@hooks/useTabBar";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { useTranslation } from "react-i18next";
import MissionButton from "./MissionButton";
import StreakBox from "./StreakBox";
import GlobalLevelBox from "./GlobalLevelBox";
import WelcomeBox from "./WelcomeBox";

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
					{/* Texte de bienvenue */}
					<WelcomeBox />
					{/* Niveau actuel */}
					<GlobalLevelBox />

					{/* Série */}
					<StreakBox />

					{/* Missions */}
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
