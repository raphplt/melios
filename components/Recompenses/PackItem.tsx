import { useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { lightenColor } from "@utils/colors";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	const { setSelectedPack } = useData();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handlePress = () => {
		navigation.navigate("pack");
		setSelectedPack(pack);
	};

	const darkColor = lightenColor(pack.color ?? theme.colors.background, 0.45);
	const lightColor = lightenColor(pack.color ?? theme.colors.background, 0.1);

	return (
		<LinearGradient
			style={{
				borderRadius: 10,
				borderColor: pack.color,
				borderWidth: 1,
				width: "95%",
				padding: 10,
				marginVertical: 6,
				margin: "auto",
			}}
			start={[0, 0]}
			colors={[darkColor, lightColor]}
			className="mx-auto w-[95%] p-4 my-2"
		>
			<View className="flex flex-row items-center justify-between">
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-[16px]"
				>
					{pack.name}
				</Text>
			</View>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="py-2 text-sm"
			>
				{pack.description}
			</Text>

			<ZoomableView>
				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
					}}
					className="rounded-2xl p-3 my-1 flex flex-row items-center justify-center"
					onPress={handlePress}
				>
					<Text
						style={{
							color: theme.colors.textSecondary,
						}}
						className="text-center font-semibold text-[16px] mx-2"
					>
						{t("discover")}
					</Text>
					<Iconify
						icon="mdi:arrow-right"
						size={24}
						color={theme.colors.textSecondary}
					/>
				</Pressable>
			</ZoomableView>
		</LinearGradient>
	);
}
