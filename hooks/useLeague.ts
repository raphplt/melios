import { useEffect, useState } from "react";
import { League } from "../type/league";
import { Member } from "../type/member";
import {
	getAllLeagues,
	getLeagueById,
	initializeDefaultLeagues,
} from "../db/leagues";
import { updateMemberField, getAllMembersInLeague } from "../db/member";
import { addRewardsToMember } from "../db/rewards";
import { LeagueProgressionService } from "../services/LeagueProgressionService";

export const useLeague = (
	member: Member | null,
	setMember: ((member: Member) => void) | null
) => {
	const [leagues, setLeagues] = useState<League[]>([]);
	const [currentLeague, setCurrentLeague] = useState<League | null>(null);
	const [topMembers, setTopMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);

	// Fonction pour calculer la progression de ligue
	const calculateLeagueProgression = async (member: Member) => {
		if (!member.league) return;

		try {
			const updatedMember =
				await LeagueProgressionService.checkAndApplyProgression(member);

			if (updatedMember && setMember) {
				setMember(updatedMember);

				// Recharger la ligue actuelle si elle a changé
				if (updatedMember.league?.leagueId !== member.league?.leagueId) {
					const newLeague = await getLeagueById(updatedMember.league!.leagueId);
					if (newLeague) {
						setCurrentLeague(newLeague);
					}
				}
			}
		} catch (error) {
			console.error("Error in league progression calculation:", error);
		}
	};

	useEffect(() => {
		const setupMember = async () => {
			try {
				// Initialiser les ligues par défaut si nécessaire
				await initializeDefaultLeagues();

				// Attendre un peu pour s'assurer que l'initialisation est complète
				await new Promise((resolve) => setTimeout(resolve, 100));

				// Récupérer toutes les ligues après initialisation
				const allLeagues = await getAllLeagues();
				console.log(
					"All leagues after initialization:",
					allLeagues.map((l) => l.name)
				);
				setLeagues(allLeagues);

				if (!member?.league?.leagueId) {
					if (member && !member.league && allLeagues.length > 0) {
						const lowestLeague = allLeagues.reduce(
							(min, l) => (l.rank < min.rank ? l : min),
							allLeagues[0]
						);
						const newLeague = {
							leagueId: lowestLeague.id,
							points: 0,
							rank: lowestLeague.rank,
							weeklyPoints: 0,
							lastWeeklyReset: new Date().toISOString(),
						};
						await updateMemberField("league", newLeague);
						if (setMember) {
							setMember({ ...member, league: newLeague });
						}
						setCurrentLeague(lowestLeague);
					} else if (allLeagues.length === 0) {
						console.error("No leagues found even after initialization!");
					}
				} else {
					const userLeague = await getLeagueById(member.league.leagueId);
					if (userLeague) {
						setCurrentLeague(userLeague);

						// Vérifier la progression de ligue
						await calculateLeagueProgression(member);
					} else {
						console.warn(`User league ${member.league.leagueId} not found`);
						// Si la ligue du membre n'existe pas, assigner la première ligue disponible
						if (allLeagues.length > 0) {
							const firstLeague = allLeagues.sort((a, b) => a.rank - b.rank)[0];
							const fixedLeague = {
								...member.league,
								leagueId: firstLeague.id,
								rank: firstLeague.rank,
							};
							await updateMemberField("league", fixedLeague);
							if (setMember) {
								setMember({ ...member, league: fixedLeague });
							}
							setCurrentLeague(firstLeague);
						}
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
		const fetchTopMembers = async () => {
			if (!currentLeague) return;

			try {
				// Récupérer les meilleurs membres de la ligue actuelle pour le podium
				const allMembersInLeague = await getAllMembersInLeague(currentLeague.id);
				const sortedMembers = allMembersInLeague
					.sort(
						(a: Member, b: Member) =>
							(b.league?.points ?? 0) - (a.league?.points ?? 0)
					)
					.slice(0, 10); // Top 10 pour le podium

				setTopMembers(sortedMembers);
			} catch (error) {
				console.error("Error fetching top members:", error);
			}
		};

		fetchTopMembers();
	}, [currentLeague]);

	return {
		leagues,
		currentLeague,
		topMembers,
		loading,
	};
};
