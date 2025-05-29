import { ScrollView, Image, View } from "react-native";
import { League } from "../type/league";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getContrastingColor } from "@utils/colors";

interface LeagueBarProps {
	leagues: League[];
	currentLeagueId: string | undefined;
}

export const LeagueBar = ({ leagues, currentLeagueId }: LeagueBarProps) => {
	return (
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
				.map((league) => (
					<View
						key={league.id}
						className={`mx-1.5 py-2 ${
							currentLeagueId === league.id ? "opacity-100 scale-110" : "opacity-30"
						}`}
					>
						<View
							className="w-12 h-12 rounded-full items-center justify-center"
							style={{ backgroundColor: league.color }}
						>
							<MaterialCommunityIcons
								name="trophy"
								size={24}
								color={getContrastingColor(league.color)}
							/>
						</View>
					</View>
				))}
		</ScrollView>
	);
};
