import { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Text } from "react-native";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { getAllRewardsPaginated } from "@db/rewards";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import CardClassement from "@components/Agora/CardClassement";
import { useTranslation } from "react-i18next";
import ButtonClose from "@components/Shared/ButtonClose";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { maj } from "@utils/textUtils";

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

			if (rewards && rewards.length < 10) setHasMoreRewards(false);

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

	const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

	return (
		<View
			className="flex-1"
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: 40,
			}}
		>
			<ButtonClose />
			<FlatList
				data={usersRewards}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<CardClassement key={item.id} rank={index + 1} reward={item} />
				)}
				onEndReached={loadMoreRewards}
				onEndReachedThreshold={0.5}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={
					hasMoreRewards ? <ActivityIndicator size="large" color="#0000ff" /> : null
				}
				ListHeaderComponent={
					<>
						<View
							className="my-3 flex items-center justify-center flex-row gap-2 w-[95%] mx-auto p-2 rounded-xl"
							style={{
								borderColor: theme.colors.primary,
								borderWidth: 2,
							}}
						>
							<Iconify icon="mdi:trophy" size={20} color={theme.colors.primary} />
							<Text
								className="text-xl text-center font-semibold"
								style={{
									color: theme.colors.primary,
									fontFamily: "Baskerville",
								}}
							>
								{t("general_classification")}
							</Text>
						</View>

						<LinearGradient
							colors={[theme.colors.redSecondary, theme.colors.blueSecondary]}
							style={{
								borderRadius: 10,
								padding: 5,
								width: "95%",
								marginTop: 10,
								marginBottom: 10,
								paddingTop: 15,
								paddingBottom: 15,
								margin: "auto",
							}}
							start={[0, 0]}
						>
							<View className="flex flex-row items-center justify-center">
								<Iconify
									icon="mingcute:snow-fill"
									size={24}
									color={theme.colors.bluePrimary}
								/>
								<Text style={{}} className="text-center text-lg font-semibold mx-3">
									{t("current_season")} : {maj(currentMonth)}
								</Text>
								<Iconify
									icon="mingcute:snow-fill"
									size={24}
									color={theme.colors.bluePrimary}
								/>
							</View>
						</LinearGradient>
					</>
				}
			/>
		</View>
	);
}