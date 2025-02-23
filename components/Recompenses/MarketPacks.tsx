import { useEffect, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { View, Text, ScrollView } from "react-native";
import PackItem from "./PackItem";
import { useTranslation } from "react-i18next";
import { getAllPacks } from "@db/packs";
import { Pack } from "@type/pack";
import { maj } from "@utils/textUtils";

export default function MarketPacks() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [packs, setPacks] = useState<Pack[]>([]);

	useEffect(() => {
		const fetchPacks = async () => {
			try {
				const data = await getAllPacks({ forceRefresh: false });
				setPacks(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des packs :", error);
			}
		};

		fetchPacks();
	}, []);

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			className="mb-24"
		>
			<View className="w-11/12 mx-auto py-1 mt-6">
				<View className="flex flex-row items-center justify-start w-full mx-auto">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-xl font-bold"
					>
						{maj(t("the_companions_of_travel")).toUpperCase()}
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
