import { View, Text, Image } from "react-native";
import { League } from "../type/league";
import { Member } from "../type/member";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CurrentLeagueProps {
	league: League;
	member: Member;
}

export const CurrentLeague = ({ league, member }: CurrentLeagueProps) => {
	return (
		<View
			className="flex-row items-center rounded-2xl border-3 p-4 mb-6"
			style={{ borderColor: league.color }}
		>
			<View
				className="w-12 h-12 mr-4 rounded-xl items-center justify-center"
				style={{ backgroundColor: league.color }}
			>
				<MaterialCommunityIcons name="trophy" size={24} color="white" />
			</View>
			<View className="flex-1">
				<Text className="text-xl font-bold">{league.name}</Text>
				<Text className="text-base text-gray-400 mt-1">Rang {league.rank}</Text>
				<Text className="text-base text-yellow-400 font-bold mt-1">
					{member.league?.points || 0} points cette semaine
				</Text>
			</View>
		</View>
	);
};
