import { useContext, useEffect, useRef, useState } from "react";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";

// Customs imports
import { ThemeContext } from "@context/ThemeContext";
import { Animated } from "react-native";
import { UserContext } from "@context/UserContext";
import { useData } from "@context/DataContext";
import { UserHabit } from "../types/userHabit";
import { getMemberHabits, getMemberInfos } from "@db/member";
import { isDayTime } from "@utils/timeUtils";
import { Habit } from "../types/habit";

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
	const isMounted = useRef(true);
	const rotation = useRef(new Animated.Value(0)).current;

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

	// Effects

	useEffect(() => {
		if (isFocused) {
			backgroundRefresh();
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

		return () => {
			isMounted.current = false;
		};
	}, [habits, isLoading, completedHabitsData, uncompletedHabitsData]);

	useEffect(() => {
		(async () => {
			const username = member && member.nom;
			const time = new Date().getHours();
			let message = "";

			switch (true) {
				case time < 12:
					message = `Bonjour${username ? ", " + username : ""} !`;
					break;
				case time >= 12 && time < 18:
					message = `Bon après-midi${username ? ", " + username : ""} !`;
					break;
				case time >= 18:
					message = `Bonsoir${username ? ", " + username : ""} !`;
					break;
				default:
					message = `Bonjour${username ? ", " + username : ""} !`;
			}

			setWelcomeMessage(message);
		})();
	}, [member]);

	// Functions

	const backgroundRefresh = async () => {
		try {
			const data = await getMemberHabits();
			const memberInfos = await getMemberInfos();
			setMember(memberInfos);
			setUserHabits(data);
		} catch (error) {
			handleError(error);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			setShowMissingHabits(false);
			const data = await getMemberHabits();
			const memberInfos = await getMemberInfos();
			setMember(memberInfos);
			setUserHabits(data);
			setShowMoreValidate(5);
			setShowMoreNext(5);
			setShowMoreMissed(5);
		} catch (error) {
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	// Function to handle the change of the habit status
	const handleHabitStatusChange = (habit: Habit, done: boolean) => {
		if (done) {
			setCompletedHabitsData(
				(prevHabits: Habit[]) => [...prevHabits, habit] as Habit[]
			);
			setUncompletedHabitsData((prevHabits: Habit[]) =>
				prevHabits.filter((oldHabit: Habit) => oldHabit.id !== habit.id)
			);
		} else {
			setUncompletedHabitsData(
				(prevHabits: Habit[]) => [...prevHabits, habit] as Habit[]
			);
			setCompletedHabitsData((prevHabits: Habit[]) =>
				prevHabits.filter((oldHabit: Habit) => oldHabit.id !== habit.id)
			);
		}
	};

	const rotate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const missedHabitsCount = uncompletedHabitsData.filter(
		(habit: Habit) => habit.moment < hours
	).length;

	const updateShowMore = (
		currentValue: number,
		listLength: number,
		setState: React.Dispatch<React.SetStateAction<number>>
	) => {
		if (currentValue < listLength) {
			setState((prev) => prev + 5);
		} else {
			setState(0);
		}
	};

	const updateShowValidate = () => {
		updateShowMore(
			showMoreValidate,
			completedHabitsData.length,
			setShowMoreValidate
		);
	};

	const updateShowNext = () => {
		updateShowMore(
			showMoreNext,
			uncompletedHabitsData.filter((habit: Habit) => habit.moment >= hours).length,
			setShowMoreNext
		);
	};

	const updateShowMissed = () => {
		updateShowMore(showMoreMissed, missedHabitsCount, setShowMoreMissed);
	};

	const toggleShowMore = (
		currentValue: number,
		setValue: (value: number) => void
	) => {
		setValue(currentValue > 0 ? 0 : 5);
	};

	const resetShowValidate = () => {
		toggleShowMore(showMoreValidate, setShowMoreValidate);
	};

	const resetShowNext = () => {
		toggleShowMore(showMoreNext, setShowMoreNext);
	};

	const resetShowMissed = () => {
		toggleShowMore(showMoreMissed, setShowMoreMissed);
	};

	const imageSource = isDayTime
		? require("@assets/images/illustrations/temple_day.jpg")
		: require("@assets/images/illustrations/temple_night.jpg");

	// Handlers

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	const handlePressIn = () => {
		Animated.timing(rotation, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.timing(rotation, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

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
		handleHabitStatusChange,
		handlePressIn,
		handlePressOut,
		resetShowValidate,
		resetShowNext,
		resetShowMissed,
	};
};

export default useIndex;
