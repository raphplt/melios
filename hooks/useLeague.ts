import { useEffect, useState } from "react";
import { League } from "../type/league";
import { LeagueRoom } from "../type/leagueRoom";
import { Member } from "../type/member";
import { getAllLeagues, getLeagueById } from "../db/leagues";
import {
  getLeagueRoomById,
  createOrUpdateLeagueRoom,
  getAllLeagueRooms,
  deleteLeagueRoom,
} from "../db/leagueRoom";
import {
  updateMemberField,
  getMembersByLeague,
  setMemberLeagueByUid,
} from "../db/member";
import { addRewardsToMember } from "../db/rewards";

export const useLeague = (
  member: Member | null,
  setMember: ((member: Member) => void) | null,
) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [leagueRoom, setLeagueRoom] = useState<LeagueRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const finalizeRoom = async (room: LeagueRoom) => {
    const allLs = await getAllLeagues();
    const sortedLs = [...allLs].sort((a, b) => a.rank - b.rank);
    const idx = sortedLs.findIndex((l) => l.id === room.leagueId);
    if (idx === -1) return;
    const league = sortedLs[idx];
    const higher = sortedLs[idx - 1];
    const lower = sortedLs[idx + 1];

    const membersSorted = [...room.members].sort(
      (a, b) => (b.league?.points || 0) - (a.league?.points || 0),
    );

    for (let i = 0; i < membersSorted.length; i++) {
      const m = membersSorted[i];
      let targetLeagueId = m.league?.leagueId || league.id;
      if (i < league.promotionCount && higher) targetLeagueId = higher.id;
      if (i >= membersSorted.length - league.relegationCount && lower)
        targetLeagueId = lower.id;
      const updated = {
        leagueId: targetLeagueId,
        localLeagueId: "",
        points: 0,
        rank: 0,
      };
      await setMemberLeagueByUid(m.uid, updated);
      const reward = i === 0 ? 15 : i === 1 ? 10 : i === 2 ? 5 : 2;
      await addRewardsToMember(m.uid, "rewards", reward);
    }

    await deleteLeagueRoom(room.id);
  };

  useEffect(() => {
    const setupMember = async () => {
      try {
        if (!member?.league?.leagueId) {
          const allLeagues = await getAllLeagues();
          setLeagues(allLeagues);

          if (member && !member.league && allLeagues.length > 0) {
            const lowestLeague = allLeagues.reduce(
              (min, l) => (l.rank < min.rank ? l : min),
              allLeagues[0],
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
            const end = new Date(room.weekId);
            end.setDate(end.getDate() + 7);
            if (end.getTime() <= Date.now()) {
              await finalizeRoom(room);
              const updatedLeague = {
                ...member.league,
                localLeagueId: "",
              };
              await updateMemberField("league", updatedLeague);
              if (setMember) {
                setMember({ ...member, league: updatedLeague });
              }
            } else {
              setLeagueRoom(room);
              return;
            }
          } else if (member.league) {
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

        setCreatingRoom(true);
        const weekId = new Date().toISOString().slice(0, 10);
        const rooms = await getAllLeagueRooms();
        const sameLeagueRooms = rooms.filter(
          (r) => r.leagueId === currentLeague.id && r.weekId === weekId,
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

          const userMember = {
            ...member,
            league: {
              ...member.league,
              localLeagueId: roomId,
            },
          };

          const fetched = await getMembersByLeague(currentLeague.id, [member.uid], 9);
          const allMembers = [userMember];
          for (const m of fetched) {
            const updated = {
              ...m,
              league: {
                ...(m.league || { leagueId: currentLeague.id, points: 0, rank: 0 }),
                localLeagueId: roomId,
              },
            } as Member;
            await setMemberLeagueByUid(m.uid, updated.league);
            allMembers.push(updated);
          }
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
