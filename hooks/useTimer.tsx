import { useData } from "@context/DataContext";
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import usePoints from "./usePoints";
import { Habit } from "../type/habit";

const useTimer = () => {
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const [isTimerVisible, setIsTimerVisible] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const date = moment().format("YYYY-MM-DD");
	const { addOdysseePoints } = usePoints();

	const { setUncompletedHabitsData, setCompletedHabitsData, points, setPoints } =
		useData();

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	const startTimer = (duration: number, habitParsed: Habit) => {
		if (!isTimerActive) {
			const durationSeconds = Math.round(duration * 60);
			setTimerSeconds(durationSeconds);
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
		}
		setIsTimerActive(false);
		setIsTimerVisible(false);
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
			setCompletedHabitsData((prevHabits: Habit[]) => [
				...prevHabits,
				habitParsed,
			]);
			setUncompletedHabitsData((prevHabits: Habit[]) =>
				prevHabits.filter((oldHabit: Habit) => oldHabit.id !== habitParsed.id)
			);
			await AsyncStorage.removeItem("timerSeconds");
		} catch (error) {
			console.error("Failed to parse habit:", error);
		}
	};

	return {
		timerSeconds,
		isTimerActive,
		isTimerVisible,
		startTimer,
		pauseTimer,
		stopTimer,
		date,
	};
};

export default useTimer;