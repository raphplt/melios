import { Points } from "./points";
import { Habit } from "./habit";
import { UserHabit } from "./userHabit";
import { Trophy } from "./trophy";
import { Member } from "./member";
import { Log } from "./log";
import { CombinedLevel, GenericLevel, UserLevel } from "./levels";
import { Streak } from "./streak";
import { Pack } from "./pack";

interface DataContextType {
	date: string;
	isLoading: boolean;
	points: Points;
	setPoints: React.Dispatch<React.SetStateAction<Points>>;
	habits: UserHabit[];
	setHabits: React.Dispatch<React.SetStateAction<UserHabit[]>>;
	expoPushToken: string | undefined;
	setExpoPushToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	notificationToggle: boolean;
	setNotificationToggle: React.Dispatch<React.SetStateAction<boolean>>;
	member?: Member;
	setMember: React.Dispatch<React.SetStateAction<Member | undefined>>;
	trophies: Trophy[];
	setTrophies: React.Dispatch<React.SetStateAction<Trophy[]>>;
	todayScore: number;
	setTodayScore: React.Dispatch<React.SetStateAction<number>>;
	streak: Streak | null;
	setStreak: React.Dispatch<React.SetStateAction<Streak | null>>;
	logs: Log[];
	completedHabitsToday: UserHabit[];
	setCompletedHabitsToday: React.Dispatch<React.SetStateAction<UserHabit[]>>;
	usersLevels: UserLevel[];
	setUsersLevels: React.Dispatch<React.SetStateAction<UserLevel[]>>;
	selectedLevel: CombinedLevel | null;
	setSelectedLevel: React.Dispatch<React.SetStateAction<CombinedLevel | null>>;
	selectedPack: Pack | null;
	setSelectedPack: React.Dispatch<React.SetStateAction<Pack | null>>;
}
