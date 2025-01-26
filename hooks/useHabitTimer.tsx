import { useData } from "@context/DataContext";
import { setRewards } from "@db/rewards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { useTimer } from "@context/TimerContext";
import { getHabitPoints } from "@utils/pointsUtils";
import useAddXp from "./useAddXp";
import { setHabitLog } from "@db/logs";
import notifee, { AndroidColor } from "@notifee/react-native";

const useHabitTimer = () => {
	const date = moment().format("YYYY-MM-DD");
	const { setShowHabitDetail } = useHabits();

	const {
		setTimerSeconds,
		isTimerActive,
		setIsTimerActive,
		setIsTimerVisible,
		timerRef,
	} = useTimer();

	const addXp = useAddXp()?.addXp;
	const { points, setPoints, setCompletedHabitsToday } = useData();

	const startTimer = async (habit: UserHabit) => {
		if (!isTimerActive) {
			if (!habit.duration) throw new Error("Habit has no duration");
			const durationSeconds = Math.round(habit.duration * 60);
			setTimerSeconds(durationSeconds);
			setShowHabitDetail(false);
			setIsTimerActive(true);
			setIsTimerVisible(true);

			await notifee.displayNotification({
				title: habit.name,
				body: "Le timer est en cours...",
				android: {
					channelId: "foreground_service",
					asForegroundService: true,
					color: AndroidColor.GREEN,
				},
			});

			console.log("startTimer");

			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current!);
						setIsTimerActive(false);
						setIsTimerVisible(false);
						onTimerEnd(habit);
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}
	};

	const stopTimer = async () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		await notifee.stopForegroundService();

		setIsTimerActive(false);
		setIsTimerVisible(false);
		setShowHabitDetail(true);
	};

	const pauseTimer = () => {
		if (isTimerActive) {
			clearInterval(timerRef.current!);
			setIsTimerActive(false);
		} else {
			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current!);
						setIsTimerActive(false);
						setIsTimerVisible(false);
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
			setIsTimerActive(true);
		}
	};

	const resetTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setIsTimerActive(false);
		setIsTimerVisible(false);
	};

	const onTimerEnd = async (habit: UserHabit) => {
		try {
			if (!habit) {
				return;
			}

			await setHabitLog(habit.id, date);

			const habitPoints = getHabitPoints(habit);

			// Update rewards
			await setRewards("rewards", habitPoints.rewards);
			await setRewards("odyssee", habitPoints.odyssee);
			setPoints({
				...points,
				rewards: habitPoints.rewards,
				odyssee: habitPoints.odyssee,
			});

			setCompletedHabitsToday((prev) => [...prev, habit]);

			if (addXp) {
				await addXp(habit, 10 * habit.difficulty);
			}

			await AsyncStorage.removeItem("timerSeconds");
		} catch (error) {
			console.error("Failed to parse habit:", error);
		}
	};

	return {
		startTimer,
		pauseTimer,
		stopTimer,
		resetTimer,
	};
};

export default useHabitTimer;
