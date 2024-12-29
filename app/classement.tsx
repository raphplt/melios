import { useEffect, useState } from "react";
import {
	FlatList,
	ActivityIndicator,
	View,
	Text,
	Platform,
	StatusBar,
} from "react-native";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { getAllRewardsPaginated } from "@db/rewards";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import CardClassement from "@components/Agora/CardClassement";
import { useTranslation } from "react-i18next";
import ButtonClose from "@components/Shared/ButtonClose";
import { LinearGradient } from "expo-linear-gradient";
import maj from "@utils/textUtils";

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

	const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });

	return (
		<View
			className="flex-1"
			style={{
				paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
			}}
		>
			<ButtonClose />
			<View
				className="my-3 pt-2 flex items-center justify-center flex-row gap-2 w-11/12 mx-auto p-2 rounded-xl"
				style={{
					backgroundColor: theme.colors.cardBackground,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
			>
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

			<LinearGradient
				colors={[theme.colors.yellowSecondary, theme.colors.greenSecondary]}
				style={{
					borderRadius: 10,
					padding: 5,
				}}
				start={[0, 0]}
				className="w-11/12 mx-auto my-3 py-6"
			>
				<View className="flex flex-row items-center justify-center ">
					<Iconify icon="mdi:fire" size={24} color={theme.colors.redPrimary} />
					<Text style={{}} className="text-center text-lg font-semibold mx-3">
						{t("current_season")} : {maj(currentMonth)}
					</Text>
					<Iconify icon="mdi:fire" size={24} color={theme.colors.redPrimary} />
				</View>
			</LinearGradient>

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