import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_MEMBER_INFO_KEY } from "../db/member";

/**
 * Utilitaires de debug pour le système de ligues
 * À utiliser uniquement en développement
 */
export class LeagueDebugUtils {
	/**
	 * Affiche le contenu du cache local
	 */
	static async logCacheContents(): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);
				console.log("=== CACHE CONTENTS ===");
				console.log("Member UID:", data.uid);
				console.log(
					"Cache Timestamp:",
					data.cacheTimestamp
						? new Date(data.cacheTimestamp).toLocaleString()
						: "No timestamp"
				);
				console.log("League Data:", {
					leagueId: data.league?.leagueId || "None",
					points: data.league?.points || 0,
					weeklyPoints: data.league?.weeklyPoints || 0,
					rank: data.league?.rank || 0,
					lastWeeklyReset: data.league?.lastWeeklyReset || "None",
				});
				console.log("======================");
			} else {
				console.log("=== NO CACHE DATA ===");
			}
		} catch (error) {
			console.error("Error reading cache:", error);
		}
	}

	/**
	 * Ajoute des points de test pour le debug
	 */
	static async addTestPoints(points: number = 100): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);
				if (data.league) {
					data.league.points = (data.league.points || 0) + points;
					data.league.weeklyPoints = (data.league.weeklyPoints || 0) + points;
					data.cacheTimestamp = Date.now();

					await AsyncStorage.setItem(
						LOCAL_STORAGE_MEMBER_INFO_KEY,
						JSON.stringify(data)
					);
					console.log(`Added ${points} test points. Total: ${data.league.points}`);
				} else {
					console.log("No league data to modify");
				}
			} else {
				console.log("No cache data found");
			}
		} catch (error) {
			console.error("Error adding test points:", error);
		}
	}

	/**
	 * Reset les points de ligue pour les tests
	 */
	static async resetLeaguePoints(): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);
				if (data.league) {
					data.league.points = 0;
					data.league.weeklyPoints = 0;
					data.cacheTimestamp = Date.now();

					await AsyncStorage.setItem(
						LOCAL_STORAGE_MEMBER_INFO_KEY,
						JSON.stringify(data)
					);
					console.log("League points reset to 0");
				}
			}
		} catch (error) {
			console.error("Error resetting league points:", error);
		}
	}

	/**
	 * Valide la structure des données de ligue
	 */
	static async validateLeagueStructure(): Promise<boolean> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (!cachedData) {
				console.log("❌ No cache data");
				return false;
			}

			const data = JSON.parse(cachedData);
			const league = data.league;

			console.log("=== LEAGUE STRUCTURE VALIDATION ===");

			const checks = [
				{ name: "League exists", pass: !!league },
				{ name: "Has leagueId", pass: typeof league?.leagueId === "string" },
				{ name: "Has points (number)", pass: typeof league?.points === "number" },
				{
					name: "Has weeklyPoints (number)",
					pass: typeof league?.weeklyPoints === "number",
				},
				{ name: "Has rank (number)", pass: typeof league?.rank === "number" },
				{
					name: "Has lastWeeklyReset (string)",
					pass: typeof league?.lastWeeklyReset === "string",
				},
				{ name: "Points are not NaN", pass: !isNaN(league?.points) },
				{ name: "WeeklyPoints are not NaN", pass: !isNaN(league?.weeklyPoints) },
			];

			let allValid = true;
			checks.forEach((check) => {
				const status = check.pass ? "✅" : "❌";
				console.log(`${status} ${check.name}`);
				if (!check.pass) allValid = false;
			});

			console.log("==================================");
			return allValid;
		} catch (error) {
			console.error("Error validating league structure:", error);
			return false;
		}
	}

	/**
	 * Ajoute des points de test pour déclencher une promotion (debug uniquement)
	 */
	static async addTestPointsForPromotion(points: number = 1000): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);
				if (data.league) {
					const oldPoints = data.league.points || 0;
					data.league.points = oldPoints + points;
					data.league.weeklyPoints = (data.league.weeklyPoints || 0) + points;
					data.cacheTimestamp = Date.now();

					await AsyncStorage.setItem(
						LOCAL_STORAGE_MEMBER_INFO_KEY,
						JSON.stringify(data)
					);
					console.log(
						`🚀 Added ${points} test points for promotion. Total: ${data.league.points}`
					);
					console.log(
						"🔄 Reload the app or trigger a habit completion to see promotion"
					);
				}
			}
		} catch (error) {
			console.error("Error adding test points for promotion:", error);
		}
	}

	/**
	 * Initialise la ligue d'un membre s'il n'en a pas (debug et première utilisation)
	 */
	static async ensureMemberHasLeague(): Promise<void> {
		try {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const data = JSON.parse(cachedData);

				// Si pas de ligue, créer une ligue par défaut (Terre)
				if (!data.league) {
					data.league = {
						leagueId: "league_1", // ID de la ligue Terre (rank 1)
						points: 0,
						rank: 1,
						weeklyPoints: 0,
						lastWeeklyReset: new Date().toISOString(),
					};
					data.cacheTimestamp = Date.now();

					await AsyncStorage.setItem(
						LOCAL_STORAGE_MEMBER_INFO_KEY,
						JSON.stringify(data)
					);
					console.log("🏟️ Default league (Terre) assigned to member");
				} else {
					console.log("✅ Member already has league:", data.league);
				}
			} else {
				console.log("❌ No cached member data found");
			}
		} catch (error) {
			console.error("Error ensuring member has league:", error);
		}
	}

	/**
	 * Vérifier et afficher toutes les ligues disponibles dans la base de données
	 */
	static async checkAvailableLeagues(): Promise<void> {
		try {
			console.log("=== CHECKING AVAILABLE LEAGUES ===");

			// Import dynamique pour éviter les erreurs de dépendances circulaires
			const { getAllLeagues } = require("../db/leagues");
			const allLeagues = await getAllLeagues();

			console.log(`Found ${allLeagues.length} leagues:`);
			allLeagues
				.sort((a: any, b: any) => a.rank - b.rank)
				.forEach((league: any) => {
					console.log(
						`- ${league.name} (ID: ${league.id}, Rank: ${league.rank}, Points Required: ${league.pointsRequired})`
					);
				});

			if (allLeagues.length === 0) {
				console.log("❌ No leagues found! Initializing default leagues...");
				const { initializeDefaultLeagues } = require("../db/leagues");
				await initializeDefaultLeagues();
				console.log("✅ Default leagues initialized");
			}

			console.log("===============================");
		} catch (error) {
			console.error("Error checking available leagues:", error);
		}
	}

	/**
	 * Forcer la réinitialisation des ligues par défaut
	 */
	static async resetDefaultLeagues(): Promise<void> {
		try {
			console.log("🔄 Resetting default leagues...");
			const { initializeDefaultLeagues } = require("../db/leagues");
			await initializeDefaultLeagues(true); // force = true
			console.log("✅ Default leagues reset complete");
		} catch (error) {
			console.error("Error resetting default leagues:", error);
		}
	}

	/**
	 * Corriger la ligue d'un membre si elle référence une ligue inexistante
	 */
	static async fixMemberLeague(): Promise<void> {
		try {
			console.log("🔧 Fixing member league...");
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);

			if (cachedData) {
				const data = JSON.parse(cachedData);

				if (data.league) {
					const { getLeagueById, getAllLeagues } = require("../db/leagues");

					// Vérifier si la ligue du membre existe
					try {
						const memberLeague = await getLeagueById(data.league.leagueId);
						if (!memberLeague) {
							console.log(
								`❌ Member league ${data.league.leagueId} not found, fixing...`
							);

							// Récupérer toutes les ligues et assigner la première (Terre)
							const allLeagues = await getAllLeagues();
							const firstLeague = allLeagues.sort(
								(a: any, b: any) => a.rank - b.rank
							)[0];

							if (firstLeague) {
								data.league = {
									leagueId: firstLeague.id,
									points: data.league.points || 0, // Conserver les points
									rank: firstLeague.rank,
									weeklyPoints: data.league.weeklyPoints || 0,
									lastWeeklyReset:
										data.league.lastWeeklyReset || new Date().toISOString(),
								};

								data.cacheTimestamp = Date.now();
								await AsyncStorage.setItem(
									LOCAL_STORAGE_MEMBER_INFO_KEY,
									JSON.stringify(data)
								);

								console.log(
									`✅ Fixed member league to ${firstLeague.name} (${firstLeague.id})`
								);
							}
						} else {
							console.log(`✅ Member league ${memberLeague.name} is valid`);
						}
					} catch (error) {
						console.error("Error checking member league:", error);
					}
				} else {
					console.log("❌ No league data found for member");
				}
			} else {
				console.log("❌ No cached member data found");
			}
		} catch (error) {
			console.error("Error fixing member league:", error);
		}
	}

	/**
	 * Corriger spécifiquement le problème d'ID de ligue incompatible
	 */
	static async fixLeagueIdMismatch(): Promise<void> {
		try {
			console.log("🔧 Fixing league ID mismatch...");
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);

			if (cachedData) {
				const data = JSON.parse(cachedData);

				if (data.league) {
					console.log(`Current member league ID: ${data.league.leagueId}`);
					console.log(`Current member points: ${data.league.points}`);

					const { getAllLeagues } = require("../db/leagues");
					const allLeagues = await getAllLeagues();

					// Map des anciens IDs vers les nouveaux
					const idMapping: { [key: string]: string } = {
						earth: "league_1", // Terre
						bronze: "league_2", // Bronze
						iron: "league_3", // Fer
						silver: "league_4", // Argent
						gold: "league_5", // Or
						platine: "league_6", // Platine
						diamond: "league_7", // Diamant
					};

					const oldId = data.league.leagueId;
					const newId = idMapping[oldId];

					if (newId) {
						// Trouver la ligue correspondante
						const targetLeague = allLeagues.find((l: any) => l.id === newId);

						if (targetLeague) {
							const oldPoints = data.league.points;

							// Déterminer la bonne ligue selon les points
							let correctLeague = targetLeague;
							const sortedLeagues = allLeagues.sort(
								(a: any, b: any) => a.rank - b.rank
							);

							// Trouver la ligue appropriée selon les points
							for (let i = sortedLeagues.length - 1; i >= 0; i--) {
								if (oldPoints >= sortedLeagues[i].pointsRequired) {
									correctLeague = sortedLeagues[i];
									break;
								}
							}

							data.league = {
								leagueId: correctLeague.id,
								points: oldPoints,
								rank: correctLeague.rank,
								weeklyPoints: data.league.weeklyPoints || 0,
								lastWeeklyReset:
									data.league.lastWeeklyReset || new Date().toISOString(),
							};

							data.cacheTimestamp = Date.now();
							await AsyncStorage.setItem(
								LOCAL_STORAGE_MEMBER_INFO_KEY,
								JSON.stringify(data)
							);

							console.log(
								`✅ Fixed league ID: ${oldId} → ${correctLeague.id} (${correctLeague.name})`
							);
							console.log(`✅ Points: ${oldPoints} → Correct league for this amount`);

							// Mettre à jour aussi dans Firebase
							const { updateMemberField } = require("../db/member");
							await updateMemberField("league", data.league);

							return;
						}
					}

					// Si pas de mapping trouvé, utiliser la logique standard
					await this.fixMemberLeague();
				}
			}
		} catch (error) {
			console.error("Error fixing league ID mismatch:", error);
		}
	}
}

// Exposer pour utilisation dans la console de debug
if (__DEV__) {
	(global as any).LeagueDebug = LeagueDebugUtils;
	console.log("🔧 League Debug Utils available as 'LeagueDebug' in console");
}
