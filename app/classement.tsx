import { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Text } from "react-native";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { getAllRewardsPaginated } from "@db/rewards";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import CardClassement from "@components/Agora/CardClassement";
import { useTranslation } from "react-i18next";

export default function Classement() {
	const [usersRewards, setUsersRewards]: any = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc]: any = useState(null);
	const [hasMoreRewards, setHasMoreRewards] = useState(true);
	const { theme } = useTheme();
	const { t } = useTranslation();

	const fetchRewards = async (isRefreshing = false) => {
		try {
			if (isRefreshing) {
				setLastVisibleDoc(null);
				setUsersRewards([]);
			}

			const { rewards, lastVisible } = await getAllRewardsPaginated(
				lastVisibleDoc
			);

			if (rewards.length < 10) setHasMoreRewards(false);

			setUsersRewards((prevRewards: any) => {
				const newRewards = isRefreshing ? rewards : [...prevRewards, ...rewards];
				const uniqueRewards = Array.from(new Set(newRewards.map((a) => a.id))).map(
					(id) => {
						return newRewards.find((a) => a.id === id);
					}
				);
				return uniqueRewards;
			});
			setLastVisibleDoc(lastVisible);
			setLoading(false);
		} catch (error) {
			console.log("Erreur lors de la récupération des récompenses : ", error);
		}
	};

	useEffect(() => {
		fetchRewards();
	}, []);

	const loadMoreRewards = () => {
		if (hasMoreRewards) fetchRewards();
	};

	if (loading) return <LoaderScreen text="Chargement du classement..." />;

	return (
		<View className="flex-1">
			<View className="my-3 pt-2 flex items-center justify-center flex-row gap-2">
				<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
				<Text
					className="text-xl text-center font-semibold"
					style={{
						color: theme.colors.text,
						fontFamily: "Baskerville",
					}}
				>
					{t("general_classification")}
				</Text>
			</View>

			<FlatList
				data={usersRewards}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<CardClassement key={item.id} rank={index + 1} reward={item} />
				)}
				onEndReached={loadMoreRewards}
				onEndReachedThreshold={0.5}
				ListFooterComponent={
					hasMoreRewards ? <ActivityIndicator size="large" color="#0000ff" /> : null
				}
			/>
		</View>
	);
}
