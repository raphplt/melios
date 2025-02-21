import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

const MissionButton = () => {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { t } = useTranslation();
	const { isDayTime } = useIndex();

	return (
		<View className="absolute bottom-6 right-5 p-2 z-30 px-4 rounded-xl overflow-hidden">
			<BlurView
				intensity={95}
				style={styles.blurView}
				tint={isDayTime ? "extraLight" : "dark"}
			/>
			{/* <View
					style={{
						backgroundColor: theme.colors.redPrimary,
					}}
					className="absolute top-1 right-1 w-4 h-4 rounded-full z-10 transform translate-x-1/2 -translate-y-1/2"
				/> */}

			<Pressable
				className="flex flex-row items-center gap-2 relative"
				onPress={() => {
					navigation.navigate("dailyRewards");
				}}
			>
				<Iconify
					icon="mdi:rocket"
					color={isDayTime ? "black" : "white"}
					size={20}
				/>
				<Text
					className="font-semibold text-[14px]"
					style={{
						color: isDayTime ? "black" : "white",
					}}
				>
					{t("missions")}
				</Text>
			</Pressable>
		</View>
	);
};

export default MissionButton;

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});
