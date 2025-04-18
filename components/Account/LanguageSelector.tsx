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

	const getFlagIcon = (value: string) => {
		return value === "fr-FR" ? (
			<Iconify icon="twemoji:flag-france" size={24} />
		) : (
			<Iconify icon="twemoji:flag-for-united-states" size={24} />
		);
	};

	const renderLanguageItem = (value: string, selected: boolean) => {
		return <View className="flex-row items-center">{getFlagIcon(value)}</View>;
	};

	return (
		<View>
			<Pressable onPress={handleOpen}>
				<View className="flex-row items-center">
					<Text
						className="mr-2 font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						{getLanguageLabel(selectedLanguage)}
					</Text>
					{renderLanguageItem(selectedLanguage, false)}
				</View>
			</Pressable>

			<BottomSlideModal
				visible={visible}
				setVisible={handleClose}
				title={t("select_language_text")}
			>
				<FlatList
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
							{renderLanguageItem(item.value, selectedLanguage === item.value)}
							<Text
								style={{
									color:
										selectedLanguage === item.value
											? theme.colors.textSecondary
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