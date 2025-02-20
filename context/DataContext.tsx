import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

import permissions from "@hooks/usePermissions";
import { getMemberInfos } from "@db/member";
import { DataContextType } from "@type/dataContext";
import { Member } from "@type/member";
import { Points } from "@type/points";
import { UserHabit } from "@type/userHabit";
import { Trophy } from "@type/trophy";
import { getNotificationToken } from "@utils/notificationsUtils";
import { getUserHabits } from "@db/userHabit";
import { Log } from "@type/log";
import { getAllHabitLogs } from "@db/logs";
import { calculateCompletedHabits } from "@utils/habitsUtils";
import { CombinedLevel, UserLevel } from "@type/levels";
import { getUserLevelsByUserId, initUserLevels } from "@db/levels";
import { useSession } from "./UserContext";
import { getRewards } from "@db/rewards";
import { extractPoints } from "@utils/pointsUtils";
import { Reward } from "@type/reward";
import { Streak } from "@type/streak";
import { getUserStreak, initializeStreak } from "@db/streaks";
import { Pack } from "@type/pack";
import { genericLevels } from "@constants/levels";

interface DataProviderProps {
	children: ReactNode;
}
export const DataContext = createContext<DataContextType | undefined>(
	undefined
);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const [habits, setHabits] = useState<UserHabit[]>([]);
	const { user } = useSession();
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
	const [usersLevels, setUsersLevels] = useState<UserLevel[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<CombinedLevel | null>(null);
	const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
	const [streak, setStreak] = useState<Streak | null>(null);

	// Progression
	const [todayScore, setTodayScore] = useState<number>(0);

	const { AskNotification } = permissions();

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
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

				// Habits
				const snapshotHabits = await getUserHabits({
					signal: abortController.signal,
					forceRefresh: true,
				});
				if (snapshotHabits) {
					setHabits(snapshotHabits);
				}

				//Rewards
				const snapshotRewards = await getRewards({
					signal: abortController.signal,
					forceRefresh: false,
				});
				if (snapshotRewards) {
					setPoints(extractPoints(snapshotRewards as Reward[]));
				}

				// Streak
				const snapshotStreak = await getUserStreak();
				if (snapshotStreak) {
					setStreak(snapshotStreak);
				} else {
					console.log("Streak not found, initializing streak...");
					const streak = await initializeStreak();
					if (streak) setStreak(streak);
				}

				// Logs
				const snapshotLogs: any = await getAllHabitLogs({
					signal: abortController.signal,
					forceRefresh: true,
				});
				if (snapshotLogs) {
					setLogs(snapshotLogs);
				}

				if (snapshotHabits && snapshotLogs) {
					const completedHabits = calculateCompletedHabits(
						snapshotHabits,
						snapshotLogs
					);
					setCompletedHabitsToday(completedHabits);
				}
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
	}, [user]);

	useEffect(() => {
		const fetchUserLevels = async () => {
			if (!user) {
				return;
			}

			try {
				const fetchedUserLevels = await getUserLevelsByUserId(user.uid);

				if (!fetchedUserLevels || Object.keys(fetchedUserLevels).length === 0) {
					await initUserLevels(user.uid, genericLevels);

					const initializedLevels = await getUserLevelsByUserId(user.uid);
					setUsersLevels(initializedLevels);
				} else {
					setUsersLevels(fetchedUserLevels);
				}
			} catch (error) {
				console.error("Erreur lors de la récupération des User Levels : ", error);
			}
		};

		if (user) {
			fetchUserLevels();
		}
	}, [user, genericLevels]);

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
				usersLevels,
				setUsersLevels,
				selectedLevel,
				setSelectedLevel,
				selectedPack,
				setSelectedPack,
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
