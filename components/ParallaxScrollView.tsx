import {
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import { Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { ThemeContext } from "./ThemeContext";
import moment from "moment";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	refreshControl?: ReactElement;
	habits: any;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	refreshControl,
	habits,
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const { theme } = useContext(ThemeContext);
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [lastDaysCompleted, setLastDaysCompleted] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

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
		let score = 0;
		if (habits && habits.length === 0) return setScoreHabits(0);
		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					score += 1;
				}
			}
		});

		if (habits.length) setScoreHabits(Math.floor((score / habits.length) * 100));
	}, [habits, date]);

	useEffect(() => {
		let lastDaysCompleted = 0;
		if (habits.length === 0) return setLastDaysCompleted(0);
		const days = 7;

		for (let i = 0; i < days; i++) {
			const date = moment().subtract(i, "days").format("YYYY-MM-DD");

			let score = 0;
			habits.forEach((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date === date && lastLog.done === true) {
						score += 1;
					}
				}
			});

			if (score === habits.length) {
				lastDaysCompleted += 1;
			}
		}

		setLastDaysCompleted(lastDaysCompleted);
	}, [habits, date]);

	return (
		<View className="">
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				className=""
				showsVerticalScrollIndicator={false}
				refreshControl={refreshControl}
			>
				<Animated.View
					style={[
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
					]}
				>
					<View className="flex items-center justify-center flex-col bg-transparent absolute top-5 left-5  z-30">
						<Image
							source={require("../assets/images/icons/flamme.png")}
							style={{ width: 50, height: 50, resizeMode: "contain" }}
						/>
						<Text
							style={{ color: theme.colors.textSecondary }}
							className="text-xl mt-1 font-semibold"
						>
							{scoreHabits} %
						</Text>
					</View>
					<View className="flex items-center justify-center flex-col bg-transparent absolute top-5 right-5  z-30">
						<Text
							className="text-[16px]"
							style={{ color: theme.colors.textSecondary }}
						>
							Streak: {lastDaysCompleted} jours
						</Text>
					</View>

					{headerImage}
				</Animated.View>
				<View style={{ backgroundColor: theme.colors.background }}>{children}</View>
			</Animated.ScrollView>
		</View>
	);
}
