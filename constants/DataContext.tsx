import React, { createContext, useState, useContext, useEffect } from "react";
import { getRewards } from "../db/rewards";

export const DataContext = createContext<any>({});

export const DataProvider = ({ children }: any) => {
	const [todayHabits, setTodayHabits]: any = useState();
	const [points, setPoints]: any = useState(0);
	const [isLoading, setIsLoading]: any = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data: any = await getRewards();
				setPoints(data[0]?.points);
			} catch (error) {
				console.log("Erreur lors de la récupération des récompenses : ", error);
			}
		})();
	}, []);

	return (
		<DataContext.Provider
			value={{
				isLoading,
				points,
				setPoints,
				todayHabits,
				setTodayHabits,
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
