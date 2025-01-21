import ButtonBack from "@components/Shared/ButtonBack";
import ButtonClose from "@components/Shared/ButtonClose";
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
	Platform,
	StatusBar,
} from "react-native";

type Props = {
	unlocked: boolean;
	setUnlocked: (value: boolean) => void;
};

const PackPreview = ({ unlocked, setUnlocked }: Props) => {
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
				flexGrow: 1,
				paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
			}}
		>
			<CachedImage
				imagePath={"images/packs/" + selectedPack.image}
				style={styles.image}
			/>
			<ButtonClose />
			<View className="flex-1 flex items-center justify-center">
				<BlurView
					tint="extraLight"
					intensity={75}
					className="p-4 w-[95%] rounded-xl mt-3 flex flex-col items-start justify-start"
					style={{
						overflow: "hidden",
						position: "absolute",
						top: 0,
					}}
				>
					<Text className="text-2xl font-bold text-black">{selectedPack.name}</Text>

					<View className="flex flex-col items-start justify-start gap-y-2">
						<Text className="font-semibold py-2 text-gray-700">
							{selectedPack.description}
						</Text>
						<View className="flex flex-row items-center gap-2">
							<Text className="font-semibold text-gray-900">
								{t("price")}: {selectedPack.price}
							</Text>
							<MoneyMelios width={18} />
						</View>
						<Text className="font-semibold text-gray-900">
							{selectedPack.content.sections.length} {t("chapters")}
						</Text>
					</View>
				</BlurView>
				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
						opacity: 0.9,
						position: "absolute",
						bottom: 4,
					}}
					className="p-3 rounded-xl mt-2 flex flex-row justify-center items-center my-2 w-11/12 mb-6"
					onPress={() => {
						setUnlocked(true);
					}}
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

export default PackPreview;
