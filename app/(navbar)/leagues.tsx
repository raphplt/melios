import { ScrollView, View, Text } from "react-native";
import { useData } from "@context/DataContext";
import { useLeague } from "../../hooks/useLeague";
import { LeagueBar } from "../../components/LeagueBar";
import { CurrentLeague } from "../../components/CurrentLeague";
import { WeeklyRanking } from "../../components/WeeklyRanking";

const LeagueCurrent = () => {
	const { member, setMember } = useData();
	const { leagues, currentLeague, leagueRoom, loading, creatingRoom } =
		useLeague(member || null, setMember);

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
			{/* <View className="bg-gray-800 rounded p-2 mb-4">
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
			</View> */}

			{/* BARRE DES LIGUES */}
			<LeagueBar leagues={leagues} currentLeagueId={member?.league?.leagueId} />

			{/* LIGUE ACTUELLE */}
			{currentLeague && <CurrentLeague league={currentLeague} member={member} />}

			{/* CLASSEMENT ROOM */}
			<Text className="text-2xl font-bold mb-3">Classement hebdomadaire</Text>
			<WeeklyRanking
				leagueRoom={leagueRoom}
				currentMember={member}
				creatingRoom={creatingRoom}
			/>
		</ScrollView>
	);
};

export default LeagueCurrent;
