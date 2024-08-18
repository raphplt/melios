import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import MoneyOdyssee from "../Svg/MoneyOdyssee";
import MoneyMelios from "../Svg/MoneyMelios";
import { lightenColor } from "../../utils/colors";

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
				<Iconify
					size={24}
					color={theme.colors.text}
					icon="solar:user-circle-outline"
				/>
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