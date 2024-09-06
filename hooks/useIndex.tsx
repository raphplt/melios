import {
	useContext,
	useEffect,
	useRef,
	useState,
	useMemo,
	useCallback,
} from "react";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";
import { ThemeContext } from "@context/ThemeContext";
import { Animated } from "react-native";
import { UserContext } from "@context/UserContext";
import { useData } from "@context/DataContext";
import { UserHabit } from "../type/userHabit";
import { getMemberHabits, getMemberInfos } from "@db/member";
import { isDayTime } from "@utils/timeUtils";
import { Habit } from "../type/habit";

const useIndex = () => {
	// Contexts
	const { user } = useContext(UserContext);
	const { theme } = useContext(ThemeContext);

	// Hooks
	const isFocused = useIsFocused();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const {
		member,
		setMember,
		habits,
		isLoading,
		uncompletedHabitsData,
		completedHabitsData,
		setUncompletedHabitsData,
		setCompletedHabitsData,
	} = useData();

	// Refs
	const rotation = useRef(new Animated.Value(0)).current;
	const abortController = useRef<AbortController | null>(null);

	// States
	const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [hours, setHours] = useState(new Date().getHours());
	const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue !");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [showMoreValidate, setShowMoreValidate] = useState(5);
	const [showMoreNext, setShowMoreNext] = useState(5);
	const [showMoreMissed, setShowMoreMissed] = useState(5);

	// Memoized values
	const missedHabitsCount = useMemo(() => {
		return uncompletedHabitsData.filter((habit: Habit) => habit.moment < hours)
			.length;
	}, [uncompletedHabitsData, hours]);

	const rotate = useMemo(() => {
		return rotation.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "360deg"],
		});
	}, [rotation]);

	const imageSource = useMemo(() => {
		return isDayTime
			? require("@assets/images/illustrations/temple_day.jpg")
			: require("@assets/images/illustrations/temple_night.jpg");
	}, [isDayTime]);

	const fetchMemberData = useCallback(
		async (signal: AbortSignal) => {
			try {
				const [data, memberInfos] = await Promise.all([
					getMemberHabits(),
					getMemberInfos(),
				]);
				if (!signal.aborted) {
					setUserHabits(data);
					setMember(memberInfos);
				}
			} catch (error) {
				if (!signal.aborted) {
					handleError(error);
				}
			}
		},
		[setMember, setUserHabits]
	);

	// Effects
	useEffect(() => {
		if (!isFocused) return;

		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();
		fetchMemberData(abortController.current.signal);
	}, [isFocused, fetchMemberData]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHours(new Date().getHours());
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setLoading(isLoading);
		setUserHabits(habits);
	}, [habits, isLoading, completedHabitsData, uncompletedHabitsData]);

	useEffect(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();
		const signal = abortController.current.signal;

		(async () => {
			const username = member?.nom || "";
			const time = new Date().getHours();
			let message = "";

			if (time < 12) {
				message = `Bonjour${username ? ", " + username : ""} !`;
			} else if (time >= 12 && time < 18) {
				message = `Bon après-midi${username ? ", " + username : ""} !`;
			} else {
				message = `Bonsoir${username ? ", " + username : ""} !`;
			}

			if (!signal.aborted) {
				setWelcomeMessage(message);
			}
		})();

		return () => {
			abortController.current?.abort();
		};
	}, [member]);

	// Functions

	//TODO pas utile ?
	const backgroundRefresh = useCallback(async () => {
		if (abortController.current) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();
		fetchMemberData(abortController.current.signal);
	}, [fetchMemberData]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		if (abortController.current) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();
		await fetchMemberData(abortController.current.signal);
		setRefreshing(false);
	}, [fetchMemberData]);

	const handleHabitStatusChange = useCallback(
		(habit: UserHabit, done: boolean) => {
			if (done) {
				setCompletedHabitsData((prevHabits: UserHabit[]) => [...prevHabits, habit]);
				setUncompletedHabitsData((prevHabits: UserHabit[]) =>
					prevHabits.filter((oldHabit: UserHabit) => oldHabit.id !== habit.id)
				);
			} else {
				setUncompletedHabitsData((prevHabits: UserHabit[]) => [
					...prevHabits,
					habit,
				]);
				setCompletedHabitsData((prevHabits: UserHabit[]) =>
					prevHabits.filter((oldHabit: UserHabit) => oldHabit.id !== habit.id)
				);
			}
		},
		[setCompletedHabitsData, setUncompletedHabitsData]
	);

	const updateShowMore = useCallback(
		(
			currentValue: number,
			listLength: number,
			setState: React.Dispatch<React.SetStateAction<number>>
		) => {
			if (currentValue < listLength) {
				setState((prev) => prev + 5);
			} else {
				setState(0);
			}
		},
		[]
	);

	const updateShowValidate = useCallback(() => {
		updateShowMore(
			showMoreValidate,
			completedHabitsData.length,
			setShowMoreValidate
		);
	}, [showMoreValidate, completedHabitsData.length, updateShowMore]);

	const updateShowNext = useCallback(() => {
		const filteredUncompletedHabits = uncompletedHabitsData.filter(
			(habit: Habit) => habit.moment >= hours
		);
		updateShowMore(
			showMoreNext,
			filteredUncompletedHabits.length,
			setShowMoreNext
		);
	}, [uncompletedHabitsData, hours, showMoreNext, updateShowMore]);

	const updateShowMissed = useCallback(() => {
		updateShowMore(showMoreMissed, missedHabitsCount, setShowMoreMissed);
	}, [showMoreMissed, missedHabitsCount, updateShowMore]);

	const toggleShowMore = useCallback(
		(currentValue: number, setValue: (value: number) => void) => {
			setValue(currentValue > 0 ? 0 : 5);
		},
		[]
	);

	const resetShowValidate = useCallback(() => {
		toggleShowMore(showMoreValidate, setShowMoreValidate);
	}, [showMoreValidate, toggleShowMore]);

	const resetShowNext = useCallback(() => {
		toggleShowMore(showMoreNext, setShowMoreNext);
	}, [showMoreNext, toggleShowMore]);

	const resetShowMissed = useCallback(() => {
		toggleShowMore(showMoreMissed, setShowMoreMissed);
	}, [showMoreMissed, toggleShowMore]);

	// Handlers
	const handleError = useCallback((error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	}, []);

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
		user,
		userHabits,
		loading,
		refreshing,
		welcomeMessage,
		showMissingHabits,
		showMoreValidate,
		showMoreNext,
		showMoreMissed,
		missedHabitsCount,
		rotate,
		imageSource,
		uncompletedHabitsData,
		completedHabitsData,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		hours,
		isDayTime,
		isLoading,
		setWelcomeMessage,
		setShowMissingHabits,
		updateShowValidate,
		updateShowNext,
		updateShowMissed,
		onRefresh,
		backgroundRefresh,
		handlePressIn,
		handlePressOut,
		handleHabitStatusChange,
		resetShowValidate,
		resetShowNext,
		resetShowMissed,
	};
};

export default useIndex;
