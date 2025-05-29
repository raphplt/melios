import { View, Text, Image } from "react-native";
import { LeagueRoom } from "../type/leagueRoom";
import { Member } from "../type/member";
import UserBadge from "./Shared/UserBadge";

interface WeeklyRankingProps {
	leagueRoom: LeagueRoom | null;
	currentMember: Member | null;
	creatingRoom: boolean;
}

export const WeeklyRanking = ({
	leagueRoom,
	currentMember,
	creatingRoom,
}: WeeklyRankingProps) => {
	if (!leagueRoom) {
		return (
			<View className="mt-4">
				<Text className="text-gray-500 text-lg mb-4 text-center">
					{creatingRoom
						? "Création d'une nouvelle salle en cours..."
						: "Aucune salle de ligue cette semaine"}
				</Text>
			</View>
		);
	}

	const sortedMembers = [...leagueRoom.members].sort(
		(a, b) => (b.league?.points || 0) - (a.league?.points || 0)
	);

	return (
		<View className="w-full rounded-2xl p-2">
			{sortedMembers.map((member, idx) => (
				<View
					key={member.uid}
					className={`flex-row items-center py-2 border-b border-gray-700 ${
						member.uid === currentMember?.uid ? "bg-[#2E3A59] rounded-lg p-1" : ""
					}`}
				>
					<Text className="w-7 text-lg font-bold text-yellow-400 text-center">
						{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
					</Text>
					<UserBadge
						width={32}
						height={32}
						style={{ marginRight: 8 }}
						customProfilePicture={member.profilePicture || ""}
					/>
					<Text className="flex-1 text-base" numberOfLines={1}>
						{member.nom}
					</Text>
					<Text className="text-base text-yellow-400 mr-2">
						{member.league?.points || 0} pts
					</Text>
					{member.uid === currentMember?.uid && (
						<Text className="bg-yellow-400 text-[#23263A] font-bold rounded-md px-2 py-0.5 ml-1.5 text-sm">
							Vous
						</Text>
					)}
				</View>
			))}
		</View>
	);
};
