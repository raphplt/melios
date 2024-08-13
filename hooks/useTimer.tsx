import { useData } from "@context/DataContext";
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useState, useRef, useEffect } from "react";

const useTimer = () => {
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const date = moment().format("YYYY-MM-DD");
	const [doneToday, setDoneToday] = useState(false);

	const { setUncompletedHabitsData, setCompletedHabitsData, points, setPoints } =
		useData();

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	//TODO type
	const startTimer = (duration: number, habitParsed: any) => {
		if (!isTimerActive) {
			const durationSeconds = Math.round(duration * 60);
			setTimerSeconds(durationSeconds);
			setIsTimerActive(true);
			timerRef.current = setInterval(() => {
				setTimerSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						clearInterval(timerRef.current!);
						setIsTimerActive(false);
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
	};

	const onTimerEnd = async (habitParsed: any) => {
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
				odyssee: points.odyssee + habitParsed.reward + habitParsed.difficulty,
			});
			//TODO done today ?
			setCompletedHabitsData(
				(prevHabits: any) => [...prevHabits, habitParsed] as any
			);
			setUncompletedHabitsData((prevHabits: any) =>
				prevHabits.filter((oldHabit: any) => oldHabit.id !== habitParsed.id)
			);
			// Clear stored timer state after completion
			await AsyncStorage.removeItem("timerSeconds");
		} catch (error) {
			console.error("Failed to parse habit:", error);
		}
	};

	return { timerSeconds, isTimerActive, startTimer, stopTimer, date };
};

export default useTimer;
