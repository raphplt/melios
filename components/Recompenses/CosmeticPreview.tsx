import { useTheme } from "@context/ThemeContext";
import { getAllCosmeticsIcons } from "@db/cosmetics";
import { ProfileCosmetic } from "@type/cosmetics";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Iconify } from "react-native-iconify";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import IconPreview from "./IconPreview";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";

export default function CosmeticPreviewStacked() {
	const [cosmetics, setCosmetics] = useState<ProfileCosmetic[]>([]);
	const { theme } = useTheme();
	const { t } = useTranslation();
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
			<View className="w-11/12 mx-auto py-4">
				<View className="flex flex-row items-center justify-start w-full mx-auto">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-xl font-bold"
					>
						{t("cosmetic_shop").toUpperCase()}
					</Text>
				</View>
			</View>

			<LinearGradient
				colors={[theme.colors.primary, theme.colors.backgroundTertiary]}
				start={[0, 0]}
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 10,
					width: "95%",
					margin: "auto",
					display: "flex",
					flexDirection: "row",
					height: 150,
				}}
			>
				<View className="flex items-center justify-center flex-row w-[65%]">
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

				<View className="flex items-center justify-center w-[30%] py-2">
					<Iconify
						icon="mdi:arrow-right-bold-circle"
						size={40}
						color={theme.colors.primary}
					/>
					<Text
						style={{
							color: theme.colors.primary,
							fontFamily: "BaskervilleBold",
						}}
						className="mt-2 text-center"
					>
						{t("access_shop")}
					</Text>
				</View>
			</LinearGradient>
		</TouchableOpacity>
	);
}
