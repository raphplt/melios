import { useTheme } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ProfilIcon from "./ProfilIcon";
import LoaderScreen from "@components/Shared/LoaderScreen";
import * as Progress from "react-native-progress";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";

export default function MarketCosmetics() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useTheme();
	const [loading, setLoading] = useState(true);
	const { usersLevels } = useData();
	const { t } = useTranslation();

	useEffect(() => {
		async function fetchCosmetics() {
			const snapshot = await getAllCosmeticsIcons({ forceRefresh: true });
			setCosmetics(snapshot);
			setLoading(false);
		}
		fetchCosmetics();
	}, []);

	const placeholders = Array.from({ length: 12 }, (_, index) => ({
		id: index.toString(),
	}));

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any];

	const renderHeader = () => (
		<View className="w-11/12 mx-auto py-2">
			{/* Progress Indicator */}
			<View>
				<View className="flex flex-row items-center justify-between my-2">
					<Text
						style={{
							color: theme.colors.primary,
						}}
						className="text-lg font-bold mr-3"
					>
						{t("level_general")}
					</Text>
					<View className="flex flex-row items-center justify-start">
						<Text
							style={{
								color: theme.colors.primary,
							}}
							className="text-[16px] font-bold mr-1"
						>
							{globalLevel?.currentLevel || "1"}
						</Text>
					</View>
				</View>

				<Progress.Bar
					progress={
						globalLevel ? globalLevel.currentXp / globalLevel.nextLevelXp : 0
					}
					width={null}
					color={theme.colors.primary}
					unfilledColor={theme.colors.border}
					height={12}
					borderRadius={25}
					borderWidth={0}
				/>
			</View>

			<Text
				style={{ color: theme.colors.textTertiary }}
				className="text-[14px] w-11/12 font-semibold mt-3"
			>
				{t("cosmetic_shop_description")}
			</Text>
		</View>
	);

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
			{renderHeader()}
			<View className="flex flex-wrap flex-row justify-center">
				{loading
					? placeholders.map((item) => <LoaderScreen key={item.id} />)
					: cosmetics
							.sort((a, b) => a.price - b.price)
							.map((cosmetic) => <ProfilIcon key={cosmetic.id} cosmetic={cosmetic} />)}
			</View>
		</ScrollView>
	);
}