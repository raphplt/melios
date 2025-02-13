import { useTheme } from "@context/ThemeContext";
import React from "react";
import { Dimensions, ScrollView, StatusBar, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { Iconify } from "react-native-iconify";
import ButtonClose from "@components/Shared/ButtonClose";

const DailyRewards = () => {
	const { theme } = useTheme();
	return (
		<ScrollView
			style={{
				flex: 1,
				paddingTop: 40,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
			<StatusBar
				barStyle={"light-content"}
				backgroundColor={theme.colors.backgroundTertiary}
				translucent={true}
			/>
			<View
				style={{
					backgroundColor: theme.colors.backgroundTertiary,
				}}
				className="rounded-b-lg py-4"
			>
				<ButtonClose />
				<Text className="text-2xl font-bold text-center mb-4">
					Récompenses quotidiennes
				</Text>
				<Progress.Bar
					progress={0.5}
					width={Dimensions.get("window").width * 0.8}
					color={theme.colors.primary}
					height={8}
					className="mx-auto mb-4"
				/>
			</View>
			<View className="flex flex-col gap-y-4 py-4">
				<View
					className="rounded-lg p-4 mx-4 flex flex-row items-center gap-x-2"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<Iconify icon="mdi:circle-outline" size={30} color={theme.colors.text} />
					<Text>Se connecter à Melios</Text>
				</View>
				<View
					className="rounded-lg p-4 mx-4 flex flex-row items-center gap-x-2"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<Iconify icon="mdi:circle-outline" size={30} color={theme.colors.text} />
					<Text>Compléter 3 habitudes</Text>
				</View>
				<View
					className="rounded-lg p-4 mx-4 flex flex-row items-center gap-x-2"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<Iconify icon="mdi:circle-outline" size={30} color={theme.colors.text} />
					<Text>Supporter un membre dans l'Agora</Text>
				</View>
				<View
					className="rounded-lg p-4 mx-4 flex flex-row items-center gap-x-2"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<Iconify icon="mdi:circle-outline" size={30} color={theme.colors.text} />
					<Text>Écrire son journal de bord quotidien</Text>
				</View>
			</View>
		</ScrollView>
	);
};

export default DailyRewards;
