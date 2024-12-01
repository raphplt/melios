import { useTheme } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import ProfilIcon from "./ProfilIcon";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { Iconify } from "react-native-iconify";
import * as Progress from "react-native-progress";
import { useData } from "@context/DataContext";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";

export default function MarketCosmetics() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useTheme();
	const [loading, setLoading] = useState(true);
	const { points } = useData();

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

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			{/* Background Image */}
			<Image
				source={require("@assets/images/illustrations/bgCosmetic.jpg")}
				className="absolute w-full h-full"
				style={{ resizeMode: "cover", opacity: 0.2 }}
			/>

			{/* Header Section */}
			<View className="w-11/12 mx-auto py-4">
				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] w-11/12 font-semibold"
				>
					Utilisez vos points pour débloquer des avatars mythologiques uniques et
					personnaliser votre profil !
				</Text>

				{/* Progress Indicator */}
				<View className="mt-4">
					<View className="flex flex-row items-center justify-start mb-2 ">
						<Text
							style={{
								color: theme.colors.primary,
								fontFamily: "BaskervilleBold",
							}}
							className="text-[15px] mr-2"
						>
							Vos points : {points.odyssee}
						</Text>
						<MoneyOdyssee />
					</View>

					<Progress.Bar
						progress={points.odyssee / 10000}
						width={null}
						color={theme.colors.primary}
						unfilledColor={theme.colors.border}
						borderWidth={0}
						height={8}
					/>
					{/* <Progress */}
				</View>
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
