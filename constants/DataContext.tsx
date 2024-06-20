import React, { createContext, useState, useContext, useEffect } from "react";
import { getRewards } from "../db/rewards";
import { useSession } from "./UserContext";
import { getMemberHabits } from "../db/member";
import moment from "moment";

export const DataContext = createContext<any>({});

export const DataProvider = ({ children }: any) => {
	const { isLoading: isSessionLoading } = useSession();
	const [habits, setHabits]: any = useState();
	const [uncompletedHabitsData, setUncompletedHabitsData]: any = useState([]);
	const [completedHabitsData, setCompletedHabitsData]: any = useState([]);
	const [points, setPoints]: any = useState({
		rewards: 0,
		odyssee: 0,
	});
	const [isLoading, setIsLoading]: any = useState(true);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!isSessionLoading) {
			(async () => {
				try {
					const snapshotRewards: any = await getRewards();
					setPoints({
						rewards: snapshotRewards[0]?.rewards ?? 0,
						odyssee: snapshotRewards[0]?.odyssee ?? 0,
					});

					const snapshotHabits = await getMemberHabits();
					setHabits(snapshotHabits);

					const uncompleted = snapshotHabits
						.filter((habit: any) => {
							if (habit.logs) {
								const lastLog = habit.logs[habit.logs.length - 1];

								if (lastLog && lastLog.date !== date) {
									return true;
								}
								if (lastLog && lastLog.date === date && lastLog.done === false) {
									return true;
								} else if (habit.logs.length === 0) {
									return true;
								}
							}
						})
						.sort((a: any, b: any) => a.moment - b.moment);
					setUncompletedHabitsData(uncompleted);

					const completed = snapshotHabits
						.filter((habit: any) => {
							if (habit.logs) {
								const lastLog = habit.logs[habit.logs.length - 1];

								if (lastLog && lastLog.date === date && lastLog.done === true) {
									return true;
								}
							}
						})
						.sort((a: any, b: any) => a.moment - b.moment);

					setCompletedHabitsData(completed);

					setIsLoading(false);
				} catch (error) {
					console.log("Erreur lors de la récupération des récompenses : ", error);
					setIsLoading(false);
				}
			})();
		}
	}, [isSessionLoading]);

	return (
		<DataContext.Provider
			value={{
				isLoading,
				points,
				setPoints,
				habits,
				setHabits,
				uncompletedHabitsData,
				setUncompletedHabitsData,
				completedHabitsData,
				setCompletedHabitsData,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export function useData() {
	const value = useContext(DataContext);
	if (value === undefined) {
		throw new Error("useSession must be used within a DataProvider");
	}
	return value;
}