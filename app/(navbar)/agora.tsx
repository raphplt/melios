import { useContext, useEffect, useState } from "react";
import { Text, View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { getAllRewards } from "../../db/rewards";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";
import { useData } from "../../context/DataContext";
import Filters from "../../components/Agora/Filters";
import CardClassement from "../../components/Agora/CardClassement";

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
	const [loading, setLoading] = useState(true);

	const fetchRewards = async () => {
		try {
			const rewards: any = await getAllRewards(); //TODO type
			setUsersRewards(rewards);
			setLoading(false);
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

	if (loading) {
		return (
			<View className="flex items-center justify-center h-full">
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text>Chargement...</Text>
			</View>
		);
	}
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

				<Filters filter={filter} setFilter={setFilter} theme={theme} />

				<View className="flex items-center justify-center flex-col ">
					{sortedRewards.map((reward) => (
						<CardClassement
							key={reward.id}
							reward={reward}
							member={member}
							theme={theme}
						/>
					))}
				</View>
			</View>
		</ScrollView>
	);
}
