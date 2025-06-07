import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

interface League {
  id: string;
  rank: number;
  promotionCount: number;
  relegationCount: number;
}

interface Member {
  uid: string;
  nom: string;
  league?: {
    leagueId: string;
    localLeagueId: string;
    points: number;
    rank: number;
  };
}

interface LeagueRoom {
  id: string;
  leagueId: string;
  weekId: string;
  members: Member[];
}

async function finalizeRoom(room: LeagueRoom) {
  const leaguesSnap = await db.collection('leagues').get();
  const leagues = leaguesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as League[];
  const sorted = [...leagues].sort((a,b) => a.rank - b.rank);
  const idx = sorted.findIndex(l => l.id === room.leagueId);
  if (idx === -1) return;
  const league = sorted[idx];
  const higher = sorted[idx - 1];
  const lower = sorted[idx + 1];

  const membersSorted = [...room.members].sort(
    (a,b) => (b.league?.points || 0) - (a.league?.points || 0)
  );

  for (let i = 0; i < membersSorted.length; i++) {
    const m = membersSorted[i];
    let targetLeagueId = m.league?.leagueId || league.id;
    if (i < league.promotionCount && higher) targetLeagueId = higher.id;
    if (i >= membersSorted.length - league.relegationCount && lower) targetLeagueId = lower.id;

    const updatedLeague = {
      leagueId: targetLeagueId,
      localLeagueId: '',
      points: 0,
      rank: 0,
    };

    const memberSnap = await db.collection('members').where('uid', '==', m.uid).get();
    if (!memberSnap.empty) {
      await memberSnap.docs[0].ref.update({ league: updatedLeague, rewards: admin.firestore.FieldValue.increment(i === 0 ? 15 : i === 1 ? 10 : i === 2 ? 5 : 2) });
    }
  }

  await db.collection('leagueRooms').doc(room.id).delete();
}

export const handleWeeklyLeagues = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    const roomsSnap = await db.collection('leagueRooms').get();
    const now = Date.now();
    for (const doc of roomsSnap.docs) {
      const room = doc.data() as LeagueRoom;
      const end = new Date(room.weekId);
      end.setDate(end.getDate() + 7);
      end.setHours(23,59,59,999);
      if (end.getTime() <= now) {
        await finalizeRoom({ ...room, id: doc.id });
      }
    }
  });
