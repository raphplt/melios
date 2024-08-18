import React, { createContext, useState, useContext, useEffect } from "react";
import moment from "moment";
import { getRewards } from "../db/rewards";
import { useSession } from "./UserContext";
import permissions from "../hooks/usePermissions";
import { processHabits } from "../utils/habitsUtils";
import { extractPoints } from "../utils/pointsUtils";
import { getNotificationToken } from "../utils/notificationsUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types/habit";
import { Points } from "../types/points";
import { Member } from "../types/member";
import { UserHabit } from "../types/userHabit";
import usePopup from "@hooks/usePopup";
import { useProgression } from "@hooks/useProgression";
import { Trophy } from "../types/trophy";
import { getAllTrophies } from "@db/trophiesList";
import { getMemberHabits, getMemberInfos } from "@db/member";

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
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
	const [notificationToggle, setNotificationToggle] = useState<boolean>(false);
	const [points, setPoints] = useState<Points>({ rewards: 0, odyssee: 0 });
	const [member, setMember] = useState<Member>();
	const [trophies, setTrophies] = useState<Trophy[]>([]);
	const popup = usePopup();

	const { AskNotification } = permissions();

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!isSessionLoading && user) {
			const abortController = new AbortController();

			const fetchData = async () => {
				setIsLoading(true);
				try {
					await getNotificationToken(
						AskNotification,
						setExpoPushToken,
						expoPushToken
					);

					const notificationEnabled = await AsyncStorage.getItem(
						"notificationEnabled"
					);
					setNotificationToggle(notificationEnabled === "true");

					const snapshotMember = await getMemberInfos({
						signal: abortController.signal,
						forceRefresh: true,
					});
					if (!snapshotMember) throw new Error("Member not found");
					setMember(snapshotMember);

					const snapshotRewards = await getRewards({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setPoints(extractPoints(snapshotRewards));

					const snapshotHabits = await getMemberHabits({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setHabits(snapshotHabits);

					const snapshotTrophies = await getAllTrophies({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setTrophies(snapshotTrophies);

					const { uncompleted, completed } = processHabits(snapshotHabits, date);
					setUncompletedHabitsData(uncompleted);
					setCompletedHabitsData(completed);
				} catch (error: any) {
					if (error.name !== "AbortError") {
						console.log("Erreur lors de la récupération des données : ", error);
					}
				} finally {
					setIsLoading(false);
				}
			};

			fetchData();

			return () => {
				abortController.abort();
			};
		}
	}, [isSessionLoading, user]);

	return (
		<DataContext.Provider
			value={{
				date,
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
				popup,
				trophies,
				setTrophies,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export function useData() {
	const value = useContext(DataContext);
	if (value === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return value;
}
