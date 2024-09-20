import { Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import MoneyMelios from "@components/Svg/MoneyMelios";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { lightenColor } from "@utils/colors";
import getIcon from "@utils/cosmeticsUtils";

export default function CardClassement({
	rank,
	reward,
	member,
	theme,
	filter,
}: {
	rank: number;
	reward: any;
	member: any;
	theme: any;
	filter: string;
}) {
	return (
		<View
			key={reward.id}
			style={{
				backgroundColor:
					member.uid === reward.uid
						? lightenColor("#08209F", 0.1)
						: theme.colors.background,
				borderWidth: 1,
				borderColor:
					member.uid === reward.uid ? theme.colors.primary : theme.colors.border,
			}}
			className="flex flex-row justify-between items-center w-11/12 rounded-xl px-2 py-2 my-1"
		>
			<View className="flex items-center flex-row justify-center gap-2">
				<Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
					#{rank}
				</Text>
				{member?.profilePicture ? (
					<Image source={getIcon(member.profilePicture)} className="w-8 h-8 mr-5" />
				) : (
					<Image source={getIcon("man")} className="w-8 h-8 mr-5" />
				)}
				<Text style={{ color: theme.colors.text }}>{reward.name}</Text>
			</View>
			<View
				className="flex flex-row items-center justify-center px-3 rounded-xl py-1 w-fit"
				style={{
					backgroundColor: theme.colors.background,
				}}
			>
				{filter === "odyssee" ? (
					<View className="flex items-center flex-row w-fit">
						<MoneyOdyssee />
						<Text className="ml-2 w-10" style={{ color: theme.colors.text }}>
							{reward.odyssee}
						</Text>
					</View>
				) : (
					<View className="flex items-center flex-row ml-2 rounded-xl">
						<MoneyMelios />
						<Text className="ml-2 w-10" style={{ color: theme.colors.text }}>
							{reward.rewards}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
