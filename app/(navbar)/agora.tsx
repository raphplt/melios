import { useContext, useEffect, useState } from "react";
import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import { getAllRewards } from "../../db/rewards";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";
import MoneyOdyssee from "../../components/Svg/MoneyOdyssee";
import MoneyMelios from "../../components/Svg/MoneyMelios";
import { useData } from "../../context/DataContext";
import { lightenColor } from "../../utils/Utils";

interface Reward {
	id: string;
	odyssee: number;
	rewards: number;
	name: string;
	uid: string;
}

export default function Agora() {
	const [usersRewards, setUsersRewards] = useState<Reward[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [filter, setFilter] = useState<"odyssee" | "rewards">("odyssee");
	const { theme } = useContext(ThemeContext);
	const { member } = useData();

	console.log(member.uid);

	const fetchRewards = async () => {
		try {
			const rewards: Reward[] = await getAllRewards();
			setUsersRewards(rewards);
		} catch (error) {
			console.error("Erreur lors de la récupération des récompenses : ", error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchRewards();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		fetchRewards();
	};

	const sortedRewards = usersRewards
		.filter((reward) => !isNaN(reward.odyssee) && !isNaN(reward.rewards))
		.sort((a, b) => {
			if (filter === "odyssee") {
				return b.odyssee - a.odyssee;
			} else {
				return b.rewards - a.rewards;
			}
		});

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<View className="w-full">
				<View className="mb-4 flex items-center justify-center flex-row gap-2">
					<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
					<Text
						className="text-xl text-center font-semibold"
						style={{ color: theme.colors.text }}
					>
						Classement général
					</Text>
				</View>

				<View className="mb-4 flex flex-row justify-center">
					<TouchableOpacity
						style={{
							backgroundColor:
								filter === "odyssee" ? theme.colors.primary : theme.colors.background,
							paddingVertical: 10,
							paddingHorizontal: 20,
							borderRadius: 20,
							marginHorizontal: 5,
						}}
						onPress={() => setFilter("odyssee")}
					>
						<Text
							style={{
								color:
									filter === "odyssee" ? theme.colors.textSecondary : theme.colors.text,
							}}
						>
							Odyssee
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor:
								filter === "rewards" ? theme.colors.primary : theme.colors.background,
							paddingVertical: 10,
							paddingHorizontal: 20,
							borderRadius: 20,
							marginHorizontal: 5,
						}}
						onPress={() => setFilter("rewards")}
					>
						<Text
							style={{
								color:
									filter === "rewards" ? theme.colors.textSecondary : theme.colors.text,
							}}
						>
							Rewards
						</Text>
					</TouchableOpacity>
				</View>

				<View className="flex items-center justify-center flex-col ">
					{sortedRewards.map((reward) => (
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
								<Iconify
									size={24}
									color={theme.colors.text}
									icon="solar:user-circle-outline"
								/>
								<Text style={{ color: theme.colors.text }}>{reward.name}</Text>
							</View>
							<View
								className="flex flex-row items-center justify-center px-3 rounded-xl py-1 w-36"
								style={{
									backgroundColor: theme.colors.background,
								}}
							>
								<View className="flex items-center flex-row">
									<MoneyOdyssee />
									<Text className="ml-2" style={{ color: theme.colors.text }}>
										{reward.odyssee}
									</Text>
								</View>

								<View className="flex items-center flex-row ml-2 rounded-xl">
									<MoneyMelios />
									<Text className="ml-2" style={{ color: theme.colors.text }}>
										{reward.rewards}
									</Text>
								</View>
							</View>
						</View>
					))}
				</View>
			</View>
		</ScrollView>
	);
}
