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

// import { getAllTrophies } from "@db/trophiesList";
import { getMemberInfos } from "@db/member";
import { calculateStreak } from "@utils/progressionUtils";
import { DataContextType } from "@type/dataContext";
import { Member } from "@type/member";
import { Points } from "@type/points";
import { UserHabit } from "@type/userHabit";
import { getRewards } from "@db/rewards";
import { useSession } from "./UserContext";
import { Trophy } from "@type/trophy";
import { extractPoints } from "@utils/pointsUtils";
import { getNotificationToken } from "@utils/notificationsUtils";
import { getUserHabits } from "@db/userHabit";
import { Log } from "@type/log";
import { getAllHabitLogs } from "@db/logs";
import { calculateCompletedHabits } from "@utils/habitsUtils";
import { GenericLevel, UserLevel } from "@type/levels";
import { getAllGenericLevels, getUserLevelsByUserId } from "@db/levels";

interface DataProviderProps {
	children: ReactNode;
}
export const DataContext = createContext<DataContextType | undefined>(
	undefined
);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const { isLoading: isSessionLoading, user } = useSession();
	const [habits, setHabits] = useState<UserHabit[]>([]);
	const [completedHabitsToday, setCompletedHabitsToday] = useState<UserHabit[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
	const [notificationToggle, setNotificationToggle] = useState<boolean>(false);
	const [points, setPoints] = useState<Points>({ rewards: 0, odyssee: 0 });
	const [member, setMember] = useState<Member>();
	const [trophies, setTrophies] = useState<Trophy[]>([]);
	const [logs, setLogs] = useState<Log[]>([]);
	const [genericLevels, setGenericLevels] = useState<GenericLevel[]>([]);
	const [usersLevels, setUsersLevels] = useState<UserLevel[]>([]);

	// Progression
	const [todayScore, setTodayScore] = useState<number>(0);
	const [streak, setStreak] = useState<number>(0);

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
					if (snapshotRewards) {
						setPoints(extractPoints(snapshotRewards));
					}

					// Habits
					const snapshotHabits = await getUserHabits({
						signal: abortController.signal,
						forceRefresh: true,
					});
					if (snapshotHabits) {
						setHabits(snapshotHabits);
					}

					// Logs
					const snapshotLogs = await getAllHabitLogs({
						signal: abortController.signal,
						forceRefresh: true,
					});
					if (snapshotLogs) {
						setLogs(snapshotLogs);
						setStreak(calculateStreak(snapshotLogs));
					}

					if (snapshotHabits && snapshotLogs) {
						const completedHabits = calculateCompletedHabits(
							snapshotHabits,
							snapshotLogs
						);
						setCompletedHabitsToday(completedHabits);
					}

					// Generic Levels
					const snapshotGenericLevels = await getAllGenericLevels({
						signal: abortController.signal,
						forceRefresh: true,
					});
					setGenericLevels(snapshotGenericLevels);

					// User Levels
					const usersLevels = await getUserLevelsByUserId(user.uid);
					setUsersLevels(usersLevels as any);

					// Trophies
					// const snapshotTrophies = await getAllTrophies({
					// 	signal: abortController.signal,
					// 	forceRefresh: true,
					// });
					// setTrophies(snapshotTrophies);
				} catch (error: unknown) {
					if (error instanceof Error && error.name !== "AbortError") {
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
				expoPushToken,
				setExpoPushToken,
				notificationToggle,
				setNotificationToggle,
				member,
				setMember,
				trophies,
				setTrophies,
				todayScore,
				setTodayScore,
				streak,
				setStreak,
				logs,
				completedHabitsToday,
				setCompletedHabitsToday,
				genericLevels,
				setGenericLevels,
				usersLevels,
				setUsersLevels,
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