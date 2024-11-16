import { ThemeContext } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ProfilIcon from "./ProfilIcon";
import LoaderScreen from "@components/Shared/LoaderScreen";
import CosmeticPlaceHolder from "./CosmeticPlaceHolder";
import { Iconify } from "react-native-iconify";

export default function MarketCosmetics() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState(true);

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
			className="w-full h-full"
		>
			<View className=" w-11/12 mx-auto py-3">
				<View className="flex flex-row items-center">
					<Iconify icon="mdi:palette" size={24} color={theme.colors.text} />
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-lg mx-2"
					>
						Cosmétiques
					</Text>
				</View>
			</View>
			<FlatList
				data={
					loading
						? (placeholders as any)
						: cosmetics.sort((a, b) => a.price - b.price)
				}
				className="w-[95%] mx-auto"
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) =>
					loading ? <CosmeticPlaceHolder /> : <ProfilIcon cosmetic={item} />
				}
				numColumns={3}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}