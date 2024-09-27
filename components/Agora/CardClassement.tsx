import { Text, View, Image } from "react-native";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import getIcon from "@utils/cosmeticsUtils";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";

export default function CardClassement({
	rank,
	reward,
	filter,
}: {
	rank: number;
	reward: any;
	filter: string;
}) {
	const { theme } = useTheme();
	const { member } = useData();
	if (!member) return null;

	const backgroundColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "#FFDD57"; // Pastel Gold
			case 2:
				return "#D3D3D3"; // Pastel Silver
			case 3:
				return "#D2A679"; // Pastel Bronze
			default:
				return theme.colors.cardBackground;
		}
	};
	return (
		<View
			key={reward.id}
			style={{
				backgroundColor: backgroundColor(rank),
				borderWidth: 2,
				borderColor:
					member.uid === reward.uid ? theme.colors.primary : backgroundColor(rank),
			}}
			className="flex flex-row justify-between items-center w-11/12 rounded-xl px-2 py-2 my-1 mx-auto"
		>
			<View className="flex items-center flex-row justify-center gap-2">
				<Text
					style={{ color: theme.colors.text, fontWeight: "bold" }}
					className="w-7"
				>
					#{rank}
				</Text>
				{reward?.profilePicture ? (
					<Image source={getIcon(reward.profilePicture)} className="w-8 h-8 mr-2" />
				) : (
					<Image source={getIcon("man")} className="w-8 h-8 mr-2" />
				)}
				<Text style={{ color: theme.colors.text }}>{reward.name}</Text>
			</View>
			<View className="flex flex-row items-center justify-center px-3 rounded-xl py-1 w-fit">
				<View className="flex items-center flex-row w-fit">
					<MoneyOdyssee />
					<Text
						className="ml-2 w-10 font-semibold"
						style={{ color: theme.colors.text }}
					>
						{reward.odyssee}
					</Text>
				</View>
			</View>
		</View>
	);
}
