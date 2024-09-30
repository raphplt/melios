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
import { Habit } from "@type/habit";
import { useHabits } from "@context/HabitsContext";
import { getUserHabitsByMemberId } from "@db/userHabit";

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

	const { habitsData } = useHabits();

	// Refs
	const rotation = useRef(new Animated.Value(0)).current;
	const abortControllerHabits = useRef<AbortController | null>(null);
	const abortControllerMember = useRef<AbortController | null>(null);

	// States
	const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [hours, setHours] = useState(new Date().getHours());
	const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue !");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [showMoreValidate, setShowMoreValidate] = useState(3);
	const [showMoreNext, setShowMoreNext] = useState(3);
	const [showMoreMissed, setShowMoreMissed] = useState(3);

	// Memoized values
	const missedHabitsCount = useMemo(() => {
		return uncompletedHabitsData.filter(
			(habit: UserHabit) => habit.moment < hours
		).length;
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

	const fetchMemberHabitsData = useCallback(
		async (signal: AbortSignal) => {
			if (userHabits.length > 0) return;

			try {
				console.log("Fetching member habits data");
				const wdata = await getUserHabitsByMemberId(user?.uid || "");
				if (!signal.aborted) {
					setUserHabits(data);
				}
			} catch (error) {
				if (!signal.aborted) {
					handleError(error);
				}
			}
		},
		[userHabits]
	);

	const fetchMemberInfosData = useCallback(
		async (signal: AbortSignal) => {
			if (member) return;

			try {
				console.log("Fetching member infos data");
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
		[member]
	);

	const getHabitDetails = (habitId: string) => {
		return habitsData.find((habit: Habit) => habit.id === habitId);
	};

	const getUserHabitDetails = (habitId: string) => {
		return userHabits.find((habit: UserHabit) => habit.id === habitId);
	};

	// Effects
	useEffect(() => {
		if (!isFocused) return;

		if (!userHabits.length && abortControllerHabits.current) {
			abortControllerHabits.current.abort();
			abortControllerHabits.current = new AbortController();
			fetchMemberHabitsData(abortControllerHabits.current.signal);
		}
	}, [isFocused]);

	useEffect(() => {
		if (!isFocused) return;

		if (!member && abortControllerMember.current) {
			abortControllerMember.current.abort();
			abortControllerMember.current = new AbortController();
			fetchMemberInfosData(abortControllerMember.current.signal);
		}
	}, [isFocused]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHours(new Date().getHours());
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setLoading(isLoading);
		setUserHabits(habits);
	}, [habits, isLoading]); //TODO vérifier si on doit ajouter completedHabitsData et uncompletedHabitsData

	// Functions

	//TODO pas utile ?
	const backgroundRefresh = useCallback(async () => {
		if (abortControllerHabits.current) {
			console.log("Abort previous fetch");
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		fetchMemberHabitsData(abortControllerHabits.current.signal);
	}, [fetchMemberHabitsData]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		if (abortControllerHabits.current) {
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		await fetchMemberHabitsData(abortControllerHabits.current.signal);
		setRefreshing(false);
	}, [fetchMemberHabitsData]);

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
			(habit: UserHabit) => habit.moment >= hours
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
			setValue(currentValue > 0 ? 0 : 3);
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
		getHabitDetails,
		getUserHabitDetails,
	};
};

export default useIndex;