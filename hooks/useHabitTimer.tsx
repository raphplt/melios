import { useData } from "@context/DataContext";
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import usePoints from "./usePoints";
import { Habit } from "../type/habit";
import { useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { useTimer } from "@context/TimerContext";

const useHabitTimer = () => {
	const date = moment().format("YYYY-MM-DD");
	const { addOdysseePoints } = usePoints();
	const { setShowHabitDetail } = useHabits();

	const {
		setTimerSeconds,
		isTimerActive,
		setIsTimerActive,
		setIsTimerVisible,
		timerRef,
	} = useTimer();

	const { setUncompletedHabitsData, setCompletedHabitsData, points, setPoints } =
		useData();

	const startTimer = (duration: number, habitParsed: Habit) => {
		if (!isTimerActive) {
			const durationSeconds = Math.round(duration * 60);
			setTimerSeconds(durationSeconds);
			setShowHabitDetail(false);
			setIsTimerActive(true);
			setIsTimerVisible(true);
			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current!);
						setIsTimerActive(false);
						setIsTimerVisible(false);
						onTimerEnd(habitParsed);
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		}
	};

	const stopTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
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

	const onTimerEnd = async (habitParsed: Habit) => {
		try {
			if (!habitParsed) {
				return;
			}

			await setMemberHabitLog(habitParsed.id, date, true);
			await setRewards("rewards", habitParsed.reward);
			await setRewards("odyssee", habitParsed.reward + habitParsed.difficulty);
			setPoints({
				...points,
				rewards: points.rewards + habitParsed.reward,
			});
			addOdysseePoints(habitParsed.reward, habitParsed.difficulty);
			setCompletedHabitsData((prevHabits: UserHabit[]) => [
				...prevHabits,
				habitParsed,
			]);
			setUncompletedHabitsData((prevHabits: UserHabit[]) =>
				prevHabits.filter((oldHabit: UserHabit) => oldHabit.id !== habitParsed.id)
			);
			await AsyncStorage.removeItem("timerSeconds");
		} catch (error) {
			console.error("Failed to parse habit:", error);
		}
	};

	return {
		startTimer,
		pauseTimer,
		stopTimer,
	};
};

export default useHabitTimer;
