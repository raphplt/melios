import { useTheme } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ProfilIcon from "./ProfilIcon";
import LoaderScreen from "@components/Shared/LoaderScreen";
import * as Progress from "react-native-progress";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";

export default function MarketCosmetics() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useTheme();
	const [loading, setLoading] = useState(true);
	const { points, usersLevels } = useData();
	const { t } = useTranslation();

	useEffect(() => {
		async function fetchCosmetics() {
			const snapshot = await getAllCosmeticsIcons();
			setCosmetics(snapshot);
			setLoading(false);
		}
		fetchCosmetics();
	}, []);

	const placeholders = Array.from({ length: 12 }, (_, index) => ({
		id: index.toString(),
	}));

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any];

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			{/* Header Section */}
			<View className="w-11/12 mx-auto py-2">
				{/* Progress Indicator */}
				<View className="">
					<View className="flex flex-row items-center justify-between my-2 ">
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
					{/* <Progress */}
				</View>

				<Text
					style={{ color: theme.colors.textTertiary }}
					className="text-[14px] w-11/12 font-semibold mt-3"
				>
					{t("cosmetic_shop_description")}
				</Text>
			</View>

			{/* Cosmetics List */}
			<FlatList
				data={
					loading
						? (placeholders as any)
						: cosmetics.sort((a, b) => a.price - b.price)
				}
				className="w-[95%] mx-auto"
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) =>
					loading ? <LoaderScreen /> : <ProfilIcon cosmetic={item} />
				}
				numColumns={3}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
