import React from "react";
import { Text, View, Pressable, Alert, ScrollView } from "react-native";
import ButtonClose from "@components/Shared/ButtonClose";
import CachedImage from "@components/Shared/CachedImage";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import { setUserPack } from "@db/userPacks";
import { UserPack } from "@type/userPack";

const PackPreview = () => {
	const { selectedPack, setPoints } = useData();
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

	const handleUnlock = () => {
		const userPack: UserPack = {
			id: selectedPack.id,
			unlocked: true,
		};

		// setUserPack({
		// 	id: selectedPack.id,
		// 	unlocked: true,
		// });
	};

	console.log(selectedPack);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="flex-1 relative"
			style={{
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
		>
			<View
				style={{
					height: 250,
					backgroundColor: theme.colors.redPrimary,
				}}
			>
				<View className="mt-14 z-10">
					<ButtonClose />
				</View>

				<CachedImage
					imagePath={"images/packs/" + selectedPack.image}
					className="w-full h-full object-cover absolute"
				/>
			</View>
			<View className="flex-1 items-center justify-start w-full">
				<View className="w-[95%] mt-5 rounded-xl flex flex-col items-start justify-start flex-grow">
					<Text
						className="text-2xl font-bold"
						style={{
							color: theme.colors.text,
						}}
					>
						{selectedPack.name}
					</Text>

					<View className="flex flex-col items-start justify-start gap-y-2">
						<Text
							className="py-2 ml-1"
							style={{
								color: theme.colors.textTertiary,
							}}
						>
							{selectedPack.description}
						</Text>

						{/* <Text
							className="font-semibold text-lg"
							style={{ color: theme.colors.text }}
						>
							{selectedPack.content.sections.length} {t("chapters")}
						</Text> */}
					</View>

					{/* Key Results Section */}
					<View className="w-full mt-4">
						<View className="flex flex-row items-center gap-2 mb-4">
							<Iconify icon="mdi:star" size={24} color={theme.colors.primary} />
							<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
								{t("key_results")}
							</Text>
						</View>
						<View className="flex flex-col items-start justify-start">
							{selectedPack.promises?.keyResults.map((result, index) => (
								<View
									key={index}
									className="] mb-4 p-2 rounded-xl w-11/12 ml-2"
									style={{
										borderColor: theme.colors.primary,
										backgroundColor: theme.colors.background,
										borderWidth: 1,
									}}
								>
									{/* <Icon
										name={getKeyResultIcon(index)}
										size={24}
										color={theme.colors.primary}
										style={{ marginBottom: 8 }}
									/> */}
									<Text
										className="text-sm font-semibold"
										style={{ color: theme.colors.text }}
									>
										{result}
									</Text>
								</View>
							))}
						</View>
					</View>

					{/* Expectations Section */}
					{/* <View className="w-11/12 mt-3 mb-4">
						<Text
							className="text-lg font-bold mb-3"
							style={{ color: theme.colors.text }}
						>
							{t("expectations")}
						</Text>
						<View className="flex-row flex-wrap justify-between">
							{selectedPack.promises?.expectations.map((expectation, index) => (
								<View
									key={index}
									className="w-[48%] mb-4 p-2 rounded-xl"
									style={{ backgroundColor: theme.colors.cardBackground }}
								>
							
									<Text className="text-sm" style={{ color: theme.colors.text }}>
										{expectation}
									</Text>
								</View>
							))}
						</View>
					</View> */}

					<View className="flex flex-row items-center gap-2 mt-4">
						<Iconify
							icon="famicons:book-sharp"
							size={20}
							color={theme.colors.primary}
						/>

						<Text className="font-semibold text-lg">{t("chapters")}</Text>
					</View>

					<View className="flex flex-col items-start justify-start gap-y-1 mt-2 w-full mx-auto">
						{selectedPack.content.sections.map((section, index) => (
							<View
								key={index}
								className="flex flex-row items-center rounded-lg gap-2 p-1 w-full ml-2"
							>
								<Text
									className=""
									style={{
										color: theme.colors.text,
									}}
								>
									{index + 1}. {section.title}
								</Text>
							</View>
						))}
					</View>
				</View>

				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
						opacity: 0.9,
					}}
					className="mt-4 p-3 rounded-xl flex flex-row justify-center items-center my-2 w-11/12 mb-6 "
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
			</View>
		</ScrollView>
	);
};

export default PackPreview;
