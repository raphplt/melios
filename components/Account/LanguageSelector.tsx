import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Pressable,
	FlatList,
	TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import BottomSlideModal from "@components/Modals/ModalBottom";
import i18n from "../../i18n";

const LanguageSelector = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [selectedLanguage, setSelectedLanguage] = useState<string>("fr-FR");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const loadLanguage = async () => {
			const savedLanguage = await AsyncStorage.getItem("language");
			if (savedLanguage) {
				setSelectedLanguage(savedLanguage);
				i18n.changeLanguage(savedLanguage);
			}
		};
		loadLanguage();
	}, []);

	const changeLanguage = async (language: string) => {
		setSelectedLanguage(language);
		await AsyncStorage.setItem("language", language);
		i18n.changeLanguage(language);
		handleClose();
	};

	const handleOpen = () => {
		setVisible(true);
	};

	const handleClose = () => {
		setVisible(false);
	};

	const getLanguageLabel = (value: string) => {
		return value === "fr-FR" ? "Français" : "English";
	};

	const renderIcon = () => {
		return (
			<Iconify
				icon="material-symbols:language"
				size={18}
				color={theme.colors.text}
			/>
		);
	};

	return (
		<View>
			<Pressable onPress={handleOpen}>
				<View className="flex-row items-center">
					{renderIcon()}
					<Text
						className="ml-2"
						style={{
							color: theme.colors.text,
						}}
					>
						{getLanguageLabel(selectedLanguage)}
					</Text>
				</View>
			</Pressable>

			<BottomSlideModal visible={visible} setVisible={handleClose}>
				<FlatList
					ListHeaderComponent={
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-lg font-semibold mb-4"
						>
							{t("select_language_text")}
						</Text>
					}
					data={[
						{ label: "English", value: "en-US" },
						{ label: "Français", value: "fr-FR" },
					]}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => changeLanguage(item.value)}
							style={{
								padding: 10,
								backgroundColor:
									selectedLanguage === item.value ? theme.colors.primary : "transparent",
							}}
							className="flex-row items-center rounded-xl py-5"
						>
							{renderIcon()}
							<Text
								style={{
									color:
										selectedLanguage === item.value
											? theme.colors.text
											: theme.colors.textTertiary,
								}}
								className="ml-4 font-semibold"
							>
								{item.label}
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.value}
				/>
			</BottomSlideModal>
		</View>
	);
};

export default LanguageSelector;