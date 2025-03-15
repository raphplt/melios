import React, { useMemo } from "react";
import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import CardPlaceHolder from "@components/Habit/CardPlaceHolder";
import { badges } from "@utils/renderBadge";
import { Iconify } from "react-native-iconify";

interface LastDaysProps {
	logs: any[];
	loading: boolean;
}

export default function Trophies({ logs, loading }: LastDaysProps) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	// Tableau des badges avec leur seuil et libellé (paliers pouvant être ajustés)
	const badgeMilestones = useMemo(
		() => [
			{ level: "level1", threshold: 0, label: "0" },
			{ level: "level2", threshold: 1, label: "1" },
			{ level: "level3", threshold: 3, label: "3" },
			{ level: "level4", threshold: 7, label: "7" },
			{ level: "level5", threshold: 14, label: "14" },
			{ level: "level6", threshold: 21, label: "21" },
			{ level: "level7", threshold: 30, label: "30" },
			{ level: "level8", threshold: 45, label: "45" },
			{ level: "level9", threshold: 60, label: "60" },
		],
		[]
	);

	return (
		<BlurView
			intensity={100}
			style={{
				padding: 10,
				borderRadius: 12,
				width: "95%",
				alignSelf: "center",
				alignItems: "center",
				overflow: "hidden",
			}}
			tint="extraLight"
			className="mb-4"
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: "95%",
					paddingTop: 8,
					marginBottom: 4,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Iconify
						icon="material-symbols:trophy"
						size={20}
						color={theme.colors.textTertiary}
					/>
					<Text
						style={{
							color: theme.colors.text,
							fontSize: 15,
							fontWeight: "600",
							marginLeft: 4,
						}}
					>
						{t("trophies")}
					</Text>
				</View>
			</View>
			{!loading ? (
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{badgeMilestones.map((badgeItem) => {
						const acquired = logs.length >= badgeItem.threshold;
						return (
							<View
								key={badgeItem.level}
								className="relative flex items-center justify-center"
							>
								<Image
									source={badges[badgeItem.level]}
									style={[styles.badgeImage, { opacity: acquired ? 1 : 0.3 }]}
								/>
								<Text
									className="text-2xl absolute"
									style={{
										fontFamily: "BaskervilleBold",
										color: acquired ? "#050505" : "#747474",
									}}
								>
									{badgeItem.label} j
								</Text>
							</View>
						);
					})}
				</ScrollView>
			) : (
				<View style={styles.placeholderContainer}>
					{Array(5)
						.fill(null)
						.map((_, index) => (
							<CardPlaceHolder key={index} />
						))}
				</View>
			)}
		</BlurView>
	);
}

const styles = StyleSheet.create({
	badgeImage: {
		width: 90,
		height: 90,
	},
	badgeText: {
		position: "absolute",
		textAlign: "center",
		fontWeight: "bold",
		color: "#fff",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -50 }, { translateY: -10 }],
	},
	placeholderContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
	},
});
