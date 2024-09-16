import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import moment from "moment";

import permissions from "../hooks/usePermissions";

import AsyncStorage from "@react-native-async-storage/async-storage";

import usePopup from "@hooks/usePopup";
// import { getAllTrophies } from "@db/trophiesList";
import { getMemberHabits, getMemberInfos } from "@db/member";
import { calculateStreak } from "@utils/progressionUtils";
import { DataContextType } from "@type/dataContext";
import { Habit } from "@type/habit";
import { Member } from "@type/member";
import { Points } from "@type/points";
import { UserHabit } from "@type/userHabit";
import { getRewards } from "@db/rewards";
import { useSession } from "./UserContext";
import { Trophy } from "@type/trophy";
import { processHabits } from "@utils/habitsUtils";
import { extractPoints } from "@utils/pointsUtils";
import { getNotificationToken } from "@utils/notificationsUtils";
import { Category } from "@type/category";

interface DataProviderProps {
	children: ReactNode;
}
export const DataContext = createContext<DataContextType | undefined>(
	undefined
);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const { isLoading: isSessionLoading, user } = useSession();
	const [habits, setHabits] = useState<Habit[]>([]);
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

	// Progression
	const [todayScore, setTodayScore] = useState<number>(0);
	const [streak, setStreak] = useState<number>(0);

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

					// Member infos
					const snapshotMember = await getMemberInfos({
						signal: abortController.signal,
						forceRefresh: true,
					});
					if (!snapshotMember) throw new Error("Member not found");
					setMember(snapshotMember);

					//Rewards
					const snapshotRewards = await getRewards({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setPoints(extractPoints(snapshotRewards));

					// Habits
					const snapshotHabits = await getMemberHabits({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setHabits(snapshotHabits);

					// Trophies
					// const snapshotTrophies = await getAllTrophies({
					// 	signal: abortController.signal,
					// 	forceRefresh: true,
					// });
					// setTrophies(snapshotTrophies);

					// Calculate today's score
					const { uncompleted, completed } = processHabits(snapshotHabits, date);
					setUncompletedHabitsData(uncompleted);
					setCompletedHabitsData(completed);

					// Calculate streak
					const streak = calculateStreak(snapshotHabits);
					setStreak(streak);
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
				todayScore,
				setTodayScore,
				streak,
				setStreak,
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
