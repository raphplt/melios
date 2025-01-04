import { useEffect, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Iconify } from "react-native-iconify";
import PackItem from "./PackItem";
import { useTranslation } from "react-i18next";
import { getAllPacks } from "@db/packs";
import { Pack } from "@type/pack";

export default function MarketPacks() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [packs, setPacks] = useState<Pack[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPacks = async () => {
			try {
				const data = await getAllPacks({ forceRefresh: true });
				setPacks(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des packs :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPacks();
	}, []);

	if (loading) {
		return (
			<View className="py-10">
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			className="mb-20"
		>
			<View className="w-11/12 mx-auto py-1 mt-5">
				<View className="flex flex-row items-center justify-start w-full mx-auto">
					<Iconify icon="mdi:gift-outline" size={24} color={theme.colors.text} />
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="mx-2 text-[16px] font-semibold"
					>
						{t("rewards_packs")}
					</Text>
				</View>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{packs.map((pack) => (
					<PackItem key={pack.name} pack={pack} />
				))}
			</ScrollView>
		</View>
	);
}
