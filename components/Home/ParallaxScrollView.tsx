import {
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import { Text, View } from "react-native";
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
import { ThemeContext } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { Iconify } from "react-native-iconify";
import WelcomeRow from "./WelcomeRow";
import AddHabits from "./AddHabits";
import { UserHabit } from "@type/userHabit";
import { DayOfWeek } from "@type/days";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	refreshControl?: ReactElement;
}>;

export const getTodayScore = (
	habits: UserHabit[],
	completedHabitsToday: UserHabit[]
): number => {
	if (habits.length === 0) return 0;
	const today: DayOfWeek = new Date()
		.toLocaleString("en-US", { weekday: "long" })
		.toLowerCase() as DayOfWeek;
	const todayHabits = habits.filter(
		(habit) => habit.frequency && habit.frequency[today]
	);
	return Math.round((completedHabitsToday.length / todayHabits.length) * 100);
};

export default function ParallaxScrollView({
	children,
	headerImage,
	refreshControl,
}: Props) {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	const { theme } = useContext(ThemeContext);
	const { isDayTime } = useIndex();
	const { streak, completedHabitsToday, habits } = useData();

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

	const todayScore = getTodayScore(habits, completedHabitsToday);
	const [flammeColor, setFlammeColor] = useState("#FFD580");

	useEffect(() => {
		if (todayScore >= 0 && todayScore < 30) {
			setFlammeColor("#FFD580");
		} else if (todayScore >= 30 && todayScore < 60) {
			setFlammeColor("#FFB347");
		} else if (todayScore >= 60 && todayScore < 100) {
			setFlammeColor("#FF6961");
		}
	}, [todayScore]);

	const color = isDayTime ? "black" : "white";

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
						<Flamme color={flammeColor ?? theme.colors.redSecondary} />
						<Text
							style={{
								color: color,
							}}
							className="text-lg mt-1 font-semibold text-center"
						>
							{todayScore}%
						</Text>
					</BlurBox>

					<BlurBox position={{ top: 20, right: 20 }}>
						<View className="flex flex-row items-center gap-2">
							<Iconify icon="mdi:calendar" color={color} size={20} />
							<Text
								className="font-semibold text-[15px]"
								style={{
									color: color,
								}}
							>
								Série : {streak} {streak > 1 ? "jours" : "jour"}
							</Text>
						</View>
					</BlurBox>
					<BlurBox position={{ bottom: 20, left: 20 }}>
						<WelcomeRow />
					</BlurBox>
					<View className="absolute z-30 bottom-5 right-5">
						<AddHabits />
					</View>

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
		</>
	);
}
