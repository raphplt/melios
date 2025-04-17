import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { Animated } from "react-native";
import { useData } from "@context/DataContext";
import { UserHabit } from "../type/userHabit";
import { getMemberInfos } from "@db/member";
import { currentHour, isDayTime } from "@utils/timeUtils";
import { Habit } from "@type/habit";
import { useHabits } from "@context/HabitsContext";
import { getUserHabits } from "@db/userHabit";
import { getCachedImage } from "@db/files";

const useIndex = () => {
	const { theme } = useTheme();
	const { member, setMember, habits, isLoading } = useData();
	const { habitsData } = useHabits();
	const isFocused = useIsFocused();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const rotation = useRef(new Animated.Value(0)).current;
	const abortControllerHabits = useRef<AbortController | null>(null);
	const abortControllerMember = useRef<AbortController | null>(null);

	const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [hours, setHours] = useState<number>(new Date().getHours());
	const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue !");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [imageTemple, setImageTemple] = useState<string | null>(null);

	const rotate = useMemo(() => {
		return rotation.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "360deg"],
		});
	}, [rotation]);

	const handleError = useCallback((error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes :", error);
	}, []);

	useEffect(() => {
		let isMounted = true;
		const fetchImage = async () => {
			try {
				let name = "temple_day.png";

				//Crépuscule
				if (hours >= 18 && hours < 20) {
					name = "temple_dusk.png";
				}
				//Nuit
				else if (hours >= 20 || hours < 6) {
					name = "temple_night.png";
				}

				const localUri = await getCachedImage(`images/illustrations/${name}`);
				if (isMounted) {
					setImageTemple(localUri);
				}
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		fetchImage();
		return () => {
			isMounted = false;
		};
	}, [isDayTime]);

	const fetchMemberInfosData = useCallback(
		async (signal: AbortSignal) => {
			if (member) return;
			try {
				const memberInfos = await getMemberInfos();
				if (!signal.aborted) {
					setMember(memberInfos);
				}
			} catch (error) {
				if (!signal.aborted) {
					handleError(error);
				}
			}
		},
		[member, setMember, handleError]
	);

	useEffect(() => {
		if (!isFocused) return;
		if (!member) {
			abortControllerMember.current?.abort();
			abortControllerMember.current = new AbortController();
			fetchMemberInfosData(abortControllerMember.current.signal);
		}
	}, [isFocused, member, fetchMemberInfosData]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHours(new Date().getHours());
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setLoading(isLoading);
		setUserHabits(habits);
	}, [habits, isLoading]);

	const backgroundRefresh = useCallback(async () => {
		if (abortControllerHabits.current) {
			console.log("Abort previous fetch");
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		try {
			await getUserHabits({
				signal: abortControllerHabits.current.signal,
				forceRefresh: true,
			});
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) {
				handleError(error);
			}
		}
	}, [handleError]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		if (abortControllerHabits.current) {
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		try {
			await getUserHabits({
				signal: abortControllerHabits.current.signal,
				forceRefresh: true,
			});
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) {
				handleError(error);
			}
		} finally {
			setRefreshing(false);
		}
	}, [handleError]);

	const getHabitDetails = useCallback(
		(name: string) => habitsData.find((habit: Habit) => habit.name === name),
		[habitsData]
	);

	const getUserHabitDetails = useCallback(
		(habitId: string) =>
			userHabits.find((habit: UserHabit) => habit.id === habitId),
		[userHabits]
	);

	const handlePressIn = useCallback(() => {
		Animated.timing(rotation, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [rotation]);

	const handlePressOut = useCallback(() => {
		Animated.timing(rotation, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [rotation]);

	return {
		theme,
		navigation,
		userHabits,
		loading,
		refreshing,
		welcomeMessage,
		showMissingHabits,
		rotate,
		imageTemple,
		hours,
		isDayTime,
		isLoading,
		setWelcomeMessage,
		setShowMissingHabits,
		onRefresh,
		backgroundRefresh,
		handlePressIn,
		handlePressOut,
		getHabitDetails,
		getUserHabitDetails,
	};
};

export default useIndex;
