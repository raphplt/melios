import { ThemeContext } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ProfilIcon from "./ProfilIcon";
import { Iconify } from "react-native-iconify";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import IconPreview from "./IconPreview";

export default function CosmeticPreviewStacked() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		async function fetchCosmetics() {
			const snapshot = await getAllCosmeticsIcons();
			setCosmetics(snapshot);
		}
		fetchCosmetics();
	}, []);

	return (
		<TouchableOpacity
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			onPress={() => navigation.navigate("cosmeticShop")}
		>
			<View className=" w-11/12 mx-auto py-3">
				<View className="flex flex-row items-center justify-start w-full mx-auto">
					<Iconify icon="vaadin:shop" size={20} color={theme.colors.text} />
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="t mx-2"
					>
						Boutique de cosmétiques
					</Text>
				</View>
			</View>

			<View
				className="flex flex-row items-center justify-center w-[95%] mx-auto rounded-lg p-4 shadow-md"
				style={{
					backgroundColor: theme.colors.backgroundTertiary,
				}}
			>
				<View className="relative flex items-center justify-center flex-row h-full w-[65%]">
					{cosmetics.slice(0, 3).map((cosmetic, index) => {
						const rotation =
							index === 0 ? "-rotate-6" : index === 2 ? "rotate-6" : "rotate-0";
						const zIndex = index === 1 ? 10 : index === 0 ? 5 : 1;

						return (
							<View
								key={cosmetic.id}
								className={`absolute ${rotation}`}
								style={{
									left: index * 40,
									zIndex: zIndex,
								}}
							>
								<IconPreview cosmetic={cosmetic} />
							</View>
						);
					})}
				</View>

				<View className="flex items-center justify-center w-[30%] h-full">
					<Iconify
						icon="mdi:arrow-right-bold-circle"
						size={40}
						color={theme.colors.primary}
					/>
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-base mt-3 text-center"
					>
						Accéder à la boutique
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
