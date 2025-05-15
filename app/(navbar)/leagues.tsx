import { useEffect, useState } from "react";
import { getAllLeagues, getLeagueById } from "../../db/leagues";
import {
	getLeagueRoomById,
	createOrUpdateLeagueRoom,
	getAllLeagueRooms,
} from "../../db/leagueRoom";
import { League } from "../../type/league";
import { LeagueRoom } from "../../type/leagueRoom";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import { useData } from "@context/DataContext";
import { updateMemberField } from "../../db/member";
import type { Member } from "../../type/member";

const LeagueCurrent = () => {
	const { member, setMember } = useData();
	const [leagues, setLeagues] = useState<League[]>([]);
	const [league, setLeague] = useState<League | null>(null);
	const [leagueRoom, setLeagueRoom] = useState<LeagueRoom | null>(null);

	// console.log("member", member);

	useEffect(() => {
		getAllLeagues().then(setLeagues);
	}, []);

	useEffect(() => {
		if (member && !member.league) {
			getAllLeagues().then((leagues) => {
				if (leagues.length > 0) {
					const lowestLeague = leagues.reduce(
						(min, l) => (l.rank < min.rank ? l : min),
						leagues[0]
					);
					const newLeague = {
						leagueId: lowestLeague.id,
						localLeagueId: "",
						points: 0,
						rank: 0,
					};
					updateMemberField("league", newLeague).then(() => {
						if (setMember) setMember({ ...member, league: newLeague });
					});
				}
			});
		}
	}, [member, setMember]);

	useEffect(() => {
		if (
			member &&
			member.league &&
			!member.league.localLeagueId &&
			leagues.length > 0
		) {
			const memberLeague = member.league;
			if (!memberLeague || !memberLeague.leagueId) return;
			const league = leagues.find((l) => l.id === memberLeague.leagueId);
			if (!league) return;
			const weekId = new Date().toISOString().slice(0, 10);

			// 1. Chercher une room existante
			getAllLeagueRooms().then((rooms) => {
				const sameLeagueRooms = rooms.filter(
					(r) => r.leagueId === league.id && r.weekId === weekId
				);
				let targetRoom = sameLeagueRooms.find((r) => r.members.length < 10);

				if (targetRoom) {
					// 2. Ajouter le membre à la room existante
					// Vérifier qu'il n'est pas déjà dedans (sécurité)
					if (!targetRoom.members.some((m) => m.uid === member.uid)) {
						const userMember: Member = {
							...member,
							league: {
								...memberLeague,
								localLeagueId: targetRoom.id,
							},
						};
						targetRoom.members = [...targetRoom.members, userMember];
						createOrUpdateLeagueRoom(targetRoom).then(() => {
							updateMemberField("league", {
								...memberLeague,
								localLeagueId: targetRoom.id,
							}).then(() => {
								if (setMember)
									setMember({
										...member,
										league: { ...memberLeague, localLeagueId: targetRoom.id },
									});
							});
						});
					}
				} else {
					// 3. Créer une nouvelle room avec bots
					const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
					const bots = Array.from({ length: 9 }, (_, i) => generateBot(league, i));
					const userMember: Member = {
						...member,
						league: {
							...memberLeague,
							localLeagueId: roomId,
						},
					};
					const allMembers = [userMember, ...bots];
					const room: LeagueRoom = {
						id: roomId,
						leagueId: league.id,
						weekId,
						createdAt: new Date().toISOString(),
						members: allMembers,
					};
					createOrUpdateLeagueRoom(room).then(() => {
						updateMemberField("league", {
							...memberLeague,
							localLeagueId: roomId,
						}).then(() => {
							if (setMember)
								setMember({
									...member,
									league: { ...memberLeague, localLeagueId: roomId },
								});
						});
					});
				}
			});
		}
	}, [member, leagues, setMember]);

	useEffect(() => {
		if (member?.league?.leagueId) {
			getLeagueById(member.league.leagueId).then(setLeague);
		}
		if (member?.league?.localLeagueId) {
			getLeagueRoomById(member.league.localLeagueId).then(setLeagueRoom);
		}
	}, [member]);

	if (!member?.league)
		return <Text style={styles.info}>Aucune ligue en cours</Text>;

	return (
		<ScrollView contentContainerStyle={{ padding: 8 }}>
			{/* BARRE DES LIGUES */}
			<ScrollView
				contentContainerStyle={styles.leagueScroll}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{leagues
					.sort((a, b) => a.rank - b.rank)
					.map((l) => (
						<Image
							key={l.id}
							source={{ uri: l.iconUrl || "https://fakeimg.pl/48x48?text=?" }}
							style={[
								styles.leagueBadge,
								member?.league?.leagueId === l.id && styles.leagueBadgeActive,
							]}
						/>
					))}
			</ScrollView>

			{/* LIGUE ACTUELLE */}
			{league && (
				<View style={[styles.leagueBox, { borderColor: league.color }]}>
					<Image
						source={{ uri: league.iconUrl || "https://fakeimg.pl/48x48?text=?" }}
						style={styles.icon}
					/>
					<View style={{ flex: 1 }}>
						<Text style={styles.leagueName}>{league.name}</Text>
						<Text style={styles.leagueRank}>Rang {league.rank}</Text>
						<Text style={styles.leaguePoints}>
							{member.league.points} points cette semaine
						</Text>
					</View>
				</View>
			)}

			{/* CLASSEMENT ROOM */}
			<Text style={styles.sectionTitle}>Classement hebdomadaire</Text>
			{leagueRoom ? (
				<View style={styles.roomBox}>
					{leagueRoom.members
						.slice()
						.sort((a, b) => (b.league?.points || 0) - (a.league?.points || 0))
						.map((m, idx) => (
							<View
								key={m.uid}
								style={[
									styles.memberRow,
									m.uid === member.uid && styles.currentUserRow,
								]}
							>
								<Text style={styles.rank}>
									{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
								</Text>
								<Image
									source={{
										uri: m.profilePicture || "https://fakeimg.pl/36x36?text=Bot",
									}}
									style={styles.avatar}
								/>
								<Text style={styles.memberName} numberOfLines={1}>
									{m.nom}
								</Text>
								<Text style={styles.memberPoints}>{m.league?.points || 0} pts</Text>
								{m.uid === member.uid && <Text style={styles.youTag}>Vous</Text>}
							</View>
						))}
				</View>
			) : (
				<Text style={styles.info}>Aucune ligue en cours</Text>
			)}
		</ScrollView>
	);
};

// Génère un bot pour la league donnée
function generateBot(league: League, idx: number): Member {
	const botNames = [
		"Bot Leo",
		"Bot Mia",
		"Bot Max",
		"Bot Zoe",
		"Bot Sam",
		"Bot Ava",
		"Bot Tom",
		"Bot Eva",
		"Bot Lou",
		"Bot Kim",
	];
	const botAvatars = [
		"https://api.dicebear.com/7.x/bottts/svg?seed=Leo",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Mia",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Max",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Zoe",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Ava",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Tom",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Eva",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Lou",
		"https://api.dicebear.com/7.x/bottts/svg?seed=Kim",
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
		motivation: undefined,
		objectifs: [],
		aspects: [],
		temps: undefined,
		levels: [],
	};
}

const styles = StyleSheet.create({
	leagueScroll: {
		paddingHorizontal: 8,
		marginBottom: 24,
		flexDirection: "row",
		alignItems: "center",
	},
	leagueBadge: {
		width: 48,
		height: 48,
		marginHorizontal: 6,
		opacity: 0.3,
	},
	leagueBadgeActive: {
		opacity: 1,
		transform: [{ scale: 1.15 }],
	},
	leagueBox: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 16,
		borderWidth: 3,
		padding: 16,
		marginBottom: 24,
	},
	icon: {
		width: 48,
		height: 48,
		marginRight: 16,
		borderRadius: 12,
		backgroundColor: "#fff2",
	},
	leagueName: {
		fontSize: 20,
		fontWeight: "bold",
	},
	leagueRank: {
		fontSize: 16,
		color: "#C7C7C7",
		marginTop: 4,
	},
	leaguePoints: {
		fontSize: 16,
		color: "#FFD700",
		marginTop: 4,
		fontWeight: "bold",
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 12,
		alignSelf: "flex-start",
	},
	roomBox: {
		width: 320,
		backgroundColor: "#181A20",
		borderRadius: 16,
		padding: 8,
	},
	memberRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#333",
	},
	currentUserRow: {
		backgroundColor: "#2E3A59",
		borderRadius: 8,
	},
	rank: {
		width: 28,
		fontSize: 18,
		fontWeight: "bold",
		color: "#FFD700",
		textAlign: "center",
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginHorizontal: 8,
		backgroundColor: "#444",
	},
	memberName: {
		flex: 1,
		fontSize: 16,
		color: "#fff",
	},
	memberPoints: {
		fontSize: 16,
		color: "#FFD700",
		marginRight: 8,
	},
	youTag: {
		backgroundColor: "#FFD700",
		color: "#23263A",
		fontWeight: "bold",
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 2,
		marginLeft: 6,
		fontSize: 13,
	},
	info: {
		color: "#888",
		fontSize: 18,
		marginTop: 40,
		textAlign: "center",
	},
});

export default LeagueCurrent;
