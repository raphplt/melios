import {
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import { Text, View, useColorScheme } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import moment from "moment";
import { UserHabit } from "../../type/userHabit";
import BlurBox from "./ParallaxBlurBox";
import TrophiesMinView from "@components/Trophies/TrophiesMinView";
import { useTabBarPadding } from "@hooks/useTabBar";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	refreshControl?: ReactElement;
	habits: UserHabit[];
	isDayTime: boolean;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	refreshControl,
	habits,
	isDayTime,
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const { theme } = useContext(ThemeContext);
	const { todayScore } = useData();
	const [flammeColor, setFlammeColor] = useState("#FFD580");
	const { streak } = useData();

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
	});

	useEffect(() => {
		if (todayScore) {
			if (todayScore >= 0 && todayScore < 30) {
				setFlammeColor("#FFD580");
			}
			if (todayScore >= 30 && todayScore < 60) {
				setFlammeColor("#FFB347");
			}
			if (todayScore >= 60 && todayScore < 100) {
				setFlammeColor("#FF6961");
			}
		}
	}, [todayScore]);

	return (
		<Animated.ScrollView
			ref={scrollRef}
			scrollEventThrottle={16}
			showsVerticalScrollIndicator={false}
			refreshControl={refreshControl}
		>
			<Animated.View
				style={[
					{ backgroundColor: headerBackgroundColor[colorScheme] },
					headerAnimatedStyle,
				]}
			>
				<BlurBox position={{ top: 20, left: 20 }}>
					<Flamme color={flammeColor ?? theme.colors.redSecondary} />
					<Text
						style={{
							color: isDayTime ? "black" : "white",
						}}
						className="text-xl mt-1 font-semibold text-center"
					>
						{todayScore ? todayScore : 0}%
					</Text>
				</BlurBox>

				<BlurBox position={{ top: 20, right: 20 }}>
					<Text
						className="font-bold"
						style={{
							color: isDayTime ? "black" : "white",
						}}
					>
						Série : {streak} {streak > 1 ? "jours" : "jour"}
					</Text>
				</BlurBox>

				{/* <BlurBox position={{ bottom: 20, right: 20 }}>
					<TrophiesMinView />
				</BlurBox> */}

				{headerImage}
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
	);
}
