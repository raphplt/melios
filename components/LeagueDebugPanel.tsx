import React from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { LeagueDebugUtils } from "../utils/LeagueDebugUtils";
import { useLeaguePointsWithPromotion } from "../hooks/useLeaguePointsWithPromotion";

/**
 * Composant de debug pour tester les promotions (développement uniquement)
 */
export const LeagueDebugPanel: React.FC = () => {
	const { theme } = useTheme();
	const { member, setMember } = useData();
	const { addPointsAndCheckPromotion } = useLeaguePointsWithPromotion();

	if (!__DEV__ || !member) return null;

	const handleAddTestPoints = async (points: number) => {
		await addPointsAndCheckPromotion(member, points, setMember);
	};

	const handleShowInfo = async () => {
		await LeagueDebugUtils.logCacheContents();
		await LeagueDebugUtils.validateLeagueStructure();
	};

	const handleEnsureLeague = async () => {
		await LeagueDebugUtils.ensureMemberHasLeague();
		// Forcer le rechargement du membre
		if (member) {
			const { getMemberInfos } = require("../db/member");
			const freshMember = await getMemberInfos({ forceRefresh: true });
			if (freshMember && setMember) {
				setMember(freshMember);
			}
		}
	};

	const handleCheckLeagues = async () => {
		await LeagueDebugUtils.checkAvailableLeagues();
	};

	const handleResetLeagues = async () => {
		await LeagueDebugUtils.resetDefaultLeagues();
		await handleCheckLeagues(); // Vérifier après reset
	};

	const handleFixMemberLeague = async () => {
		await LeagueDebugUtils.fixMemberLeague();
		// Forcer le rechargement du membre
		if (member) {
			const { getMemberInfos } = require("../db/member");
			const freshMember = await getMemberInfos({ forceRefresh: true });
			if (freshMember && setMember) {
				setMember(freshMember);
			}
		}
	};

	const handleFixLeagueId = async () => {
		await LeagueDebugUtils.fixLeagueIdMismatch();
		// Forcer le rechargement du membre
		if (member) {
			const { getMemberInfos } = require("../db/member");
			const freshMember = await getMemberInfos({ forceRefresh: true });
			if (freshMember && setMember) {
				setMember(freshMember);
			}
		}
	};

	return (
		<View
			style={{
				position: "absolute",
				bottom: 100,
				right: 20,
				backgroundColor: theme.colors.cardBackground,
				borderRadius: 12,
				padding: 12,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 5,
				minWidth: 150,
			}}
		>
			<Text
				style={{
					fontSize: 12,
					fontWeight: "bold",
					color: theme.colors.text,
					marginBottom: 8,
					textAlign: "center",
				}}
			>
				🔧 League Debug
			</Text>

			<TouchableOpacity
				onPress={() => handleAddTestPoints(50)}
				style={{
					backgroundColor: theme.colors.primary,
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					+50 pts
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handleAddTestPoints(200)}
				style={{
					backgroundColor: theme.colors.secondary,
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					+200 pts (Bronze)
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handleAddTestPoints(500)}
				style={{
					backgroundColor: "#CD7F32",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					+500 pts (Fer)
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleEnsureLeague}
				style={{
					backgroundColor: "#4CAF50",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					Init League
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleCheckLeagues}
				style={{
					backgroundColor: "#FF9800",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					Check Leagues
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleResetLeagues}
				style={{
					backgroundColor: "#F44336",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					Reset Leagues
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleFixLeagueId}
				style={{
					backgroundColor: "#FF5722",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					Fix League ID
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleFixMemberLeague}
				style={{
					backgroundColor: "#9C27B0",
					borderRadius: 8,
					padding: 8,
					marginBottom: 4,
				}}
			>
				<Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>
					Fix Member
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={handleShowInfo}
				style={{
					backgroundColor: theme.colors.border,
					borderRadius: 8,
					padding: 8,
				}}
			>
				<Text
					style={{ color: theme.colors.text, fontSize: 10, textAlign: "center" }}
				>
					Info
				</Text>
			</TouchableOpacity>
		</View>
	);
};
