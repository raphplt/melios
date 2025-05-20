import { useEffect, useState } from "react";
import { getAllLeagues, getLeagueById } from "../../db/leagues";
import {
	getLeagueRoomById,
	createOrUpdateLeagueRoom,
	getAllLeagueRooms,
} from "../../db/leagueRoom";
import { League } from "../../type/league";
import { LeagueRoom } from "../../type/leagueRoom";
import { ScrollView, View, Text, Image } from "react-native";
import { useData } from "@context/DataContext";
import { updateMemberField } from "../../db/member";
import type { Member } from "../../type/member";

const LeagueCurrent = () => {
	const { member, setMember } = useData();
	const [leagues, setLeagues] = useState<League[]>([]);
	const [currentLeague, setCurrentLeague] = useState<League | null>(null);
	const [leagueRoom, setLeagueRoom] = useState<LeagueRoom | null>(null);
	const [loading, setLoading] = useState(true);
	const [creatingRoom, setCreatingRoom] = useState(false);

	// Initial setup - load leagues only if needed
	useEffect(() => {
		const setupMember = async () => {
			try {
				// Only fetch all leagues if needed for assignment or display
				if (!member?.league?.leagueId) {
					console.log("No league assigned, fetching leagues for initial assignment");
					const allLeagues = await getAllLeagues();
					setLeagues(allLeagues);

					// If user exists but has no league, assign the lowest one
					if (member && !member.league && allLeagues.length > 0) {
						const lowestLeague = allLeagues.reduce(
							(min, l) => (l.rank < min.rank ? l : min),
							allLeagues[0]
						);
						console.log("Assigning initial league:", lowestLeague.name);
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
					// If user already has a league, just load that one and the options
					console.log("Loading current league:", member.league.leagueId);
					const userLeague = await getLeagueById(member.league.leagueId);
					if (userLeague) {
						setCurrentLeague(userLeague);
						// Fetch all leagues just for the display bar
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

	// Load or create league room
	useEffect(() => {
		const setupLeagueRoom = async () => {
			if (!member?.league?.leagueId || creatingRoom || !currentLeague) {
				return;
			}

			try {
				// If we already have a room ID, load that room
				if (member.league.localLeagueId) {
					const room = await getLeagueRoomById(member.league.localLeagueId);
					if (room) {
						setLeagueRoom(room);
						console.log("Loaded existing room:", room.id);
						return;
					} else {
						console.warn("Room not found despite having ID, will create a new one");
						// Reset the room ID since it doesn't exist
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

				// No valid room ID, create or join one
				setCreatingRoom(true);
				console.log("Finding or creating room for league:", currentLeague.name);

				const weekId = new Date().toISOString().slice(0, 10);
				const rooms = await getAllLeagueRooms();
				const sameLeagueRooms = rooms.filter(
					(r) => r.leagueId === currentLeague.id && r.weekId === weekId
				);

				let targetRoom = sameLeagueRooms.find((r) => r.members.length < 10);

				if (targetRoom) {
					// Join existing room if we're not already in it
					if (!targetRoom.members.some((m) => m.uid === member.uid)) {
						console.log("Joining existing room:", targetRoom.id);
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
						// We're already in this room
						setLeagueRoom(targetRoom);
					}
				} else {
					// Create a new room
					console.log("Creating new room for league:", currentLeague.name);
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
					console.log("Created new room:", roomId);
				}
			} catch (error) {
				console.error("Error creating/joining league room:", error);
				// Reset creating room state on error
				setCreatingRoom(false);
				// Clear any invalid room ID
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

	if (loading) {
		return (
			<Text className="text-gray-500 text-lg mt-10 text-center">
				Chargement des ligues...
			</Text>
		);
	}

	if (!member) {
		return (
			<Text className="text-gray-500 text-lg mt-10 text-center">
				Aucun utilisateur connecté
			</Text>
		);
	}

	return (
		<ScrollView className="p-2">
			{/* Debug Info */}
			<View className="bg-gray-800 rounded p-2 mb-4">
				<Text className="text-gray-300 text-xs">
					League ID: {member?.league?.leagueId || "None"}
				</Text>
				<Text className="text-gray-300 text-xs">
					Room ID: {member?.league?.localLeagueId || "None"}
				</Text>
				<Text className="text-gray-300 text-xs">
					Points: {member?.league?.points || 0}
				</Text>
				<Text className="text-gray-300 text-xs">
					Creating Room: {creatingRoom ? "Yes" : "No"}
				</Text>
			</View>

			{/* BARRE DES LIGUES */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 8,
					marginBottom: 24,
				}}
			>
				{leagues
					.sort((a, b) => a.rank - b.rank)
					.map((l) => (
						<Image
							key={l.id}
							source={{ uri: l.iconUrl || "https://fakeimg.pl/48x48?text=?" }}
							className={`w-12 h-12 mx-1.5 ${
								member?.league?.leagueId === l.id
									? "opacity-100 scale-110"
									: "opacity-30"
							}`}
						/>
					))}
			</ScrollView>

			{/* LIGUE ACTUELLE */}
			{currentLeague && (
				<View
					className={`flex-row items-center rounded-2xl border-3 p-4 mb-6`}
					style={{ borderColor: currentLeague.color }}
				>
					<Image
						source={{
							uri: currentLeague.iconUrl || "https://fakeimg.pl/48x48?text=?",
						}}
						className="w-12 h-12 mr-4 rounded-xl bg-white/10"
					/>
					<View className="flex-1">
						<Text className="text-xl font-bold">{currentLeague.name}</Text>
						<Text className="text-base text-gray-400 mt-1">
							Rang {currentLeague.rank}
						</Text>
						<Text className="text-base text-yellow-400 font-bold mt-1">
							{member.league?.points || 0} points cette semaine
						</Text>
					</View>
				</View>
			)}

			{/* CLASSEMENT ROOM */}
			<Text className="text-2xl font-bold mb-3">Classement hebdomadaire</Text>
			{leagueRoom ? (
				<View className="w-full rounded-2xl p-2">
					{leagueRoom.members
						.slice()
						.sort((a, b) => (b.league?.points || 0) - (a.league?.points || 0))
						.map((m, idx) => (
							<View
								key={m.uid}
								className={`flex-row items-center py-2 border-b border-gray-700 ${
									m.uid === member.uid ? "bg-[#2E3A59] rounded-lg p-1" : ""
								}`}
							>
								<Text className="w-7 text-lg font-bold text-yellow-400 text-center">
									{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
								</Text>
								<Image
									source={{
										uri: m.profilePicture || "https://fakeimg.pl/36x36?text=Bot",
									}}
									className="w-9 h-9 mx-2 rounded-full bg-gray-600"
								/>
								<Text className="flex-1 text-base text-white" numberOfLines={1}>
									{m.nom}
								</Text>
								<Text className="text-base text-yellow-400 mr-2">
									{m.league?.points || 0} pts
								</Text>
								{m.uid === member.uid && (
									<Text className="bg-yellow-400 text-[#23263A] font-bold rounded-md px-2 py-0.5 ml-1.5 text-sm">
										Vous
									</Text>
								)}
							</View>
						))}
				</View>
			) : (
				<View className="mt-4">
					<Text className="text-gray-500 text-lg mb-4 text-center">
						{creatingRoom
							? "Création d'une nouvelle salle en cours..."
							: "Aucune salle de ligue cette semaine"}
					</Text>
					{currentLeague && !creatingRoom && (
						<View className="items-center">
							<Text className="text-gray-400 text-base mb-2">
								Recherche d'une salle à rejoindre...
							</Text>
						</View>
					)}
				</View>
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

export default LeagueCurrent;