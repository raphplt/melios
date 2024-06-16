import React, { createContext, useState, useContext, useEffect } from "react";
import { getRewards } from "../db/rewards";
import { useSession } from "./UserContext";

export const DataContext = createContext<any>({});

export const DataProvider = ({ children }: any) => {
	const { isLoading: isSessionLoading } = useSession();
	const [todayHabits, setTodayHabits]: any = useState();
	const [points, setPoints]: any = useState(0);
	const [isLoading, setIsLoading]: any = useState(true);

	useEffect(() => {
		if (!isSessionLoading) {
			(async () => {
				try {
					const data: any = await getRewards();
					console.log("data", data);
					setPoints(data[0]?.points);
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