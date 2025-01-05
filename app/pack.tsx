import CachedImage from "@components/Shared/CachedImage";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { BlurView } from "expo-blur";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	Pressable,
	Alert,
} from "react-native";

const Pack = () => {
	const { selectedPack } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	if (!selectedPack) return null;

	const showComingSoonAlert = () => {
		Alert.alert(
			t("coming_soon_message"),
			t("coming_soon_description"),
			[{ text: t("ok"), onPress: () => console.log("OK Pressed") }],
			{ cancelable: false }
		);
	};

	return (
		<View
			className="flex-1 relative"
			style={{
				width: Dimensions.get("window").width,
				height: Dimensions.get("window").height,
			}}
		>
			<CachedImage
				imagePath={"images/packs/" + selectedPack.image}
				style={styles.image}
			/>
			<View className="flex-1 flex items-center justify-center">
				<BlurView
					tint="dark"
					intensity={75}
					className="p-4 rounded-lg"
					style={{
						overflow: "hidden",
					}}
				>
					<Text className="text-2xl font-bold text-white">{selectedPack.name}</Text>
				</BlurView>

				<BlurView
					tint="regular"
					intensity={75}
					className="p-4 rounded-t-xl w-full"
					style={{
						overflow: "hidden",
						position: "absolute",
						bottom: 0,
					}}
				>
					<Text className="font-semibold text-white py-2">
						{selectedPack.description}
					</Text>

					<Pressable
						style={{
							backgroundColor: theme.colors.primary,
							opacity: 0.9,
						}}
						className={`p-3 rounded-xl mt-2 flex flex-row justify-center items-center my-2`}
						onPress={showComingSoonAlert}
					>
						<Text
							style={{
								color: theme.colors.textSecondary,
							}}
							className="text-center text-lg font-semibold "
						>
							{t("unlock")}
						</Text>
						<View className="flex items-center gap-1 flex-row mx-3">
							<Text
								className="text-xl font-bold"
								style={{
									color: theme.colors.yellowPrimary,
								}}
							>
								{selectedPack.price}
							</Text>
							<MoneyMelios />
						</View>
					</Pressable>
				</BlurView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		position: "absolute",
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		resizeMode: "cover",
	},
});

export default Pack;
