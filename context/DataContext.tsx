import React, { createContext, useState, useContext, useEffect } from "react";
import moment from "moment";
import { getRewards } from "../db/rewards";
import { useSession } from "./UserContext";
import { getMemberHabits, getMemberInfos } from "../db/member";
import permissions from "../hooks/usePermissions";
import { processHabits } from "../utils/habitsUtils";
import { extractPoints } from "../utils/pointsUtils";
import { getNotificationToken } from "../utils/notificationsUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/habit";
import { Points } from "../types/points";
import { Member } from "../types/member";
import { UserHabit } from "../types/userHabit";

export const DataContext = createContext<any>({});

export const DataProvider = ({ children }: any) => {
	const { isLoading: isSessionLoading, user } = useSession();
	const [habits, setHabits] = useState<Habit[]>();
	const [uncompletedHabitsData, setUncompletedHabitsData] = useState<
		UserHabit[]
	>([]);
	const [completedHabitsData, setCompletedHabitsData] = useState<UserHabit[]>(
		[]
	);
	const [isLoading, setIsLoading]: any = useState(true);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
	const [notificationToggle, setNotificationToggle] = useState<boolean>(false);
	const [points, setPoints] = useState<Points>({
		rewards: 0,
		odyssee: 0,
	});
	const [member, setMember] = useState<Member>();

	const { AskNotification } = permissions();

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
					await getNotificationToken(
						AskNotification,
						setExpoPushToken,
						expoPushToken
					);

					const notificationEnabled = await AsyncStorage.getItem(
						"notificationEnabled"
					);
					if (notificationEnabled === "true") {
						setNotificationToggle(true);
					} else {
						setNotificationToggle(false);
					}

					const snapshotMember = await getMemberInfos();
					if (!snapshotMember) throw new Error("Member not found");
					setMember(snapshotMember);

					const snapshotRewards: any = await getRewards();
					setPoints(extractPoints(snapshotRewards));

					const snapshotHabits = await getMemberHabits();
					setHabits(snapshotHabits);

					const { uncompleted, completed } = processHabits(snapshotHabits, date);
					setUncompletedHabitsData(uncompleted);
					setCompletedHabitsData(completed);

					setIsLoading(false);
				} catch (error) {
					console.log("Erreur lors de la récupération des récompenses : ", error);
					setIsLoading(false);
				}
			})();
		}
	}, [isSessionLoading, user]);

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
				expoPushToken,
				setExpoPushToken,
				notificationToggle,
				setNotificationToggle,
				member,
				setMember,
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
