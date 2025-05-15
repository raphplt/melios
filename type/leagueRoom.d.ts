import { Member } from "./member";

export interface LeagueRoom {
	id: string;
	leagueId: string;
	weekId: string;
	createdAt: string;
	members: Member[];
}
