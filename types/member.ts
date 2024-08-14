import { Answer } from "./answer";
import { UserHabit } from "./userHabit";

export interface Member {
	id: string;
	nom: string;
	motivation: Answer;
	objectifs: Answer[];
	temps: Answer;
	aspects: Answer[];
	habits: UserHabit[];
}
