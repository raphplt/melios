import { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { getAllRewards } from "../../db/rewards";
import { useData } from "../../context/DataContext";
import LoaderScreen from "@components/Shared/LoaderScreen";
import ClassementView from "@components/Agora/ClassementView";
import { Reward } from "../../types/reward";

export default function Agora() {
	const [usersRewards, setUsersRewards] = useState<Reward[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [filter, setFilter] = useState<"odyssee" | "rewards">("odyssee");
	const { member } = useData();
	const [loading, setLoading] = useState(true);

	const fetchRewards = async () => {
		try {
			const rewards: any = await getAllRewards();
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
		setRefreshing(false);
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

	if (loading) return <LoaderScreen text="Chargement du classement..." />;

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<ClassementView
				sortedRewards={sortedRewards}
				member={member}
				filter={filter}
				setFilter={setFilter}
			/>
		</ScrollView>
	);
}
