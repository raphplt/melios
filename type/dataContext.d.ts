import { Points } from "./points";
import { Habit } from "./habit";
import { UserHabit } from "./userHabit";
import { Trophy } from "./trophy";
import { Member } from "./member";
import { Log } from "./log";

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
	popup: any;
	trophies: Trophy[];
	setTrophies: React.Dispatch<React.SetStateAction<Trophy[]>>;
	todayScore: number;
	setTodayScore: React.Dispatch<React.SetStateAction<number>>;
	streak: number;
	setStreak: React.Dispatch<React.SetStateAction<number>>;
	logs: Log[];
	completedHabitsToday: UserHabit[];
	setCompletedHabitsToday: React.Dispatch<React.SetStateAction<UserHabit[]>>;
}
