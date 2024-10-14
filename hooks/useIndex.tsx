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
import { getMemberInfos } from "@db/member";
import { isDayTime } from "@utils/timeUtils";
import { Habit } from "@type/habit";
import { useHabits } from "@context/HabitsContext";
import { getUserHabits } from "@db/userHabit";

const useIndex = () => {
	// Contexts
	const { user } = useContext(UserContext);
	const { theme } = useContext(ThemeContext);

	// Hooks
	const isFocused = useIsFocused();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { member, setMember, habits, isLoading } = useData();

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
	}, [habits, isLoading]);

	// Functions

	//TODO pas utile ?
	const backgroundRefresh = useCallback(async () => {
		if (abortControllerHabits.current) {
			console.log("Abort previous fetch");
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		getUserHabits({
			signal: abortControllerHabits.current.signal,
			forceRefresh: true,
		});
	}, [getUserHabits]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		if (abortControllerHabits.current) {
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		await getUserHabits({
			signal: abortControllerHabits.current.signal,
			forceRefresh: true,
		});
		setRefreshing(false);
	}, [getUserHabits]);

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
		rotate,
		imageSource,
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