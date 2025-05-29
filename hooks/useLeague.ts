import { useEffect, useState } from "react";
import { League } from "../type/league";
import { LeagueRoom } from "../type/leagueRoom";
import { Member } from "../type/member";
import { getAllLeagues, getLeagueById } from "../db/leagues";
import {
	getLeagueRoomById,
	createOrUpdateLeagueRoom,
	getAllLeagueRooms,
} from "../db/leagueRoom";
import { updateMemberField } from "../db/member";

export const useLeague = (
	member: Member | null,
	setMember: ((member: Member) => void) | null
) => {
	const [leagues, setLeagues] = useState<League[]>([]);
	const [currentLeague, setCurrentLeague] = useState<League | null>(null);
	const [leagueRoom, setLeagueRoom] = useState<LeagueRoom | null>(null);
	const [loading, setLoading] = useState(true);
	const [creatingRoom, setCreatingRoom] = useState(false);

	useEffect(() => {
		const setupMember = async () => {
			try {
				if (!member?.league?.leagueId) {
					const allLeagues = await getAllLeagues();
					setLeagues(allLeagues);

					if (member && !member.league && allLeagues.length > 0) {
						const lowestLeague = allLeagues.reduce(
							(min, l) => (l.rank < min.rank ? l : min),
							allLeagues[0]
						);
						const newLeague = {
							leagueId: lowestLeague.id,
							localLeagueId: "",
							points: 0,
							rank: 0,
						};
						await updateMemberField("league", newLeague);
						if (setMember) {
							setMember({ ...member, league: newLeague });
						}
						setCurrentLeague(lowestLeague);
					}
				} else {
					const userLeague = await getLeagueById(member.league.leagueId);
					if (userLeague) {
						setCurrentLeague(userLeague);
						const allLeagues = await getAllLeagues();
						setLeagues(allLeagues);
					}
				}
			} catch (error) {
				console.error("Error in league setup:", error);
			} finally {
				setLoading(false);
			}
		};

		setupMember();
	}, [member?.uid, member?.league?.leagueId, setMember]);

	useEffect(() => {
		const setupLeagueRoom = async () => {
			if (!member?.league?.leagueId || creatingRoom || !currentLeague) {
				return;
			}

			try {
				if (member.league.localLeagueId) {
					const room = await getLeagueRoomById(member.league.localLeagueId);
					if (room) {
						setLeagueRoom(room);
						return;
					} else {
						if (member.league) {
							const updatedLeague = {
								...member.league,
								localLeagueId: "",
							};
							await updateMemberField("league", updatedLeague);
							if (setMember) {
								setMember({ ...member, league: updatedLeague });
							}
						}
					}
				}

				setCreatingRoom(true);
				const weekId = new Date().toISOString().slice(0, 10);
				const rooms = await getAllLeagueRooms();
				const sameLeagueRooms = rooms.filter(
					(r) => r.leagueId === currentLeague.id && r.weekId === weekId
				);

				let targetRoom = sameLeagueRooms.find((r) => r.members.length < 10);

				if (targetRoom) {
					if (!targetRoom.members.some((m) => m.uid === member.uid)) {
						const userMember = {
							...member,
							league: {
								...member.league,
								localLeagueId: targetRoom.id,
							},
						};
						targetRoom.members = [...targetRoom.members, userMember];
						await createOrUpdateLeagueRoom(targetRoom);
						await updateMemberField("league", {
							...member.league,
							localLeagueId: targetRoom.id,
						});

						if (setMember) {
							setMember({
								...member,
								league: { ...member.league, localLeagueId: targetRoom.id },
							});
						}

						setLeagueRoom(targetRoom);
					} else {
						setLeagueRoom(targetRoom);
					}
				} else {
					const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
					const bots = Array.from({ length: 9 }, (_, i) =>
						generateBot(currentLeague, i)
					);

					const userMember = {
						...member,
						league: {
							...member.league,
							localLeagueId: roomId,
						},
					};

					const allMembers = [userMember, ...bots];
					const newRoom = {
						id: roomId,
						leagueId: currentLeague.id,
						weekId,
						createdAt: new Date().toISOString(),
						members: allMembers,
					};

					await createOrUpdateLeagueRoom(newRoom);
					await updateMemberField("league", {
						...member.league,
						localLeagueId: roomId,
					});

					if (setMember) {
						setMember({
							...member,
							league: { ...member.league, localLeagueId: roomId },
						});
					}

					setLeagueRoom(newRoom);
				}
			} catch (error) {
				console.error("Error creating/joining league room:", error);
				setCreatingRoom(false);
				if (member?.league?.localLeagueId) {
					const updatedLeague = {
						...member.league,
						localLeagueId: "",
					};
					await updateMemberField("league", updatedLeague);
					if (setMember) {
						setMember({ ...member, league: updatedLeague });
					}
				}
			} finally {
				setCreatingRoom(false);
			}
		};

		setupLeagueRoom();
	}, [member?.league, currentLeague, creatingRoom, setMember]);

	return {
		leagues,
		currentLeague,
		leagueRoom,
		loading,
		creatingRoom,
	};
};

// Génère un bot pour la league donnée
function generateBot(league: League, idx: number): Member {
	const botNames = [
		"Lucas",
		"Emma",
		"Hugo",
		"Léa",
		"Gabriel",
		"Jade",
		"Louis",
		"Chloé",
		"Arthur",
		"Inès",
		"Nathan",
		"Louise",
		"Jules",
		"Alice",
		"Adam",
		"Lina",
		"Raphaël",
		"Zoé",
		"Tom",
		"Sarah",
	];

	const botAvatars = [
		"https://api.dicebear.com/7.x/bottts/svg?seed=Lucas",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Emma",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Hugo",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Lea",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Gabriel",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Jade",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Louis",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Chloe",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Arthur",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Ines",
	];

	const [min, max] = league.botScoreRange || [10, 100];
	return {
		uid: `bot_${idx}_${league.id}`,
		nom: botNames[idx % botNames.length],
		profilePicture: botAvatars[idx % botAvatars.length],
		league: {
			leagueId: league.id,
			localLeagueId: "",
			points: Math.floor(Math.random() * (max - min + 1)) + min,
			rank: 0,
		},
		activityConfidentiality: "public",
		friendCode: "",
		friends: [],
		friendRequestsSent: [],
		friendRequestsReceived: [],
		motivation: {
			answer: "Modéré",
			value: 2,
		},
		objectifs: [],
		aspects: [],
		temps: {
			answer: "Moyen",
			value: 2,
		},
		levels: [],
	};
}
