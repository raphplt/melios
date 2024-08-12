import { useEffect, useState } from "react";
import moment from "moment";
import {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { getHabitById } from "@db/habits";

export const useHabitInfos = (habitId) => {
	const [habitInfos, setHabitInfos] = useState<any>({});

	useEffect(() => {
		async function fetchHabitInfos() {
			const result = await getHabitById(habitId);
			setHabitInfos(result);
		}
		fetchHabitInfos();
	}, [habitId]);

	return habitInfos;
};

export const useCurrentDate = () => {
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return date;
};

export const useAnimation = () => {
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ translateX: translateX.value }],
		};
	});

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 500 });
		return () => {
			opacity.value = withTiming(0, { duration: 500 });
		};
	}, []);

	return { animatedStyles, translateX };
};
