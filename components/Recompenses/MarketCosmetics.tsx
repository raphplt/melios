import { ThemeContext } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ProfilIcon from "./ProfilIcon";

export default function MarketCosmetics() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useContext(ThemeContext);

	useEffect(() => {
		// Fetch cosmetics
		async function fetchCosmetics() {
			const snapshot = await getAllCosmeticsIcons();
			setCosmetics(snapshot);
		}
		fetchCosmetics();
	}, []);

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="w-11/12 mx-auto my-3 text-xl pb-1"
			>
				Marché des cosmétiques
			</Text>
			<FlatList
				data={cosmetics.sort((a, b) => a.price - b.price)}
				className="w-11/12 mx-auto"
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <ProfilIcon cosmetic={item} />}
				numColumns={3}
				nestedScrollEnabled={true}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
