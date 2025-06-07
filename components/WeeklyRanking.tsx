import { View, Text } from "react-native";
import { LeagueRoom } from "../type/leagueRoom";
import { Member } from "../type/member";
import UserBadge from "./Shared/UserBadge";
import { useEffect, useState } from "react";
import { useTheme } from "@context/ThemeContext";

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
	const [timeLeft, setTimeLeft] = useState<string>("");
	const { theme } = useTheme();

	useEffect(() => {
		if (!leagueRoom) return;
		const update = () => {
			const endDate = new Date(leagueRoom.weekId);
			endDate.setDate(endDate.getDate() + 7);
			endDate.setHours(23, 59, 59, 999);
			const diff = endDate.getTime() - Date.now();
			if (diff <= 0) {
				setTimeLeft("0j 0h");
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			setTimeLeft(`${days}j ${hours}h`);
		};
		update();
		const interval = setInterval(update, 60 * 1000);
		return () => clearInterval(interval);
	}, [leagueRoom]);

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
	const maxPoints = sortedMembers[0]?.league?.points || 0;

	return (
		<View className="w-full rounded-2xl p-2">
			<Text className="text-center text-sm text-gray-400 mb-2">
				Fin dans {timeLeft}
			</Text>
			{sortedMembers.map((member, idx) => (
				<View key={member.uid}>
					<View
						className={`flex-row items-center py-2 border-b ${
							member.uid === currentMember?.uid ? "rounded-lg p-1" : ""
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
							<Text className="bg-yellow-400 font-bold rounded-md px-2 py-0.5 ml-1.5 text-sm">
								Vous
							</Text>
						)}
					</View>
					<View
						className="w-full h-1 rounded-full mt-1"
						style={{
							backgroundColor: theme.colors.background,
						}}
					>
						<View
							className="h-1 rounded-full bg-yellow-400"
							style={{
								width: `${((member.league?.points || 0) / (maxPoints || 1)) * 100}%`,
							}}
						/>
					</View>
				</View>
			))}
		</View>
	);
};