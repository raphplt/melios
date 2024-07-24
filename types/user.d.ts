export interface UserDatas {
	nom: string;
	motivation: { answer: string };
	objectifs: Array<{ answer: string }>;
	temps: { answer: string };
	aspects: Array<{ answer: string }>;
	habits: UserHabit[];
}
