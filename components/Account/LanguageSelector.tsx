import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import i18n from "../../i18n";
import { useTheme } from "@context/ThemeContext";

const LanguageSelector = () => {
	const { theme } = useTheme();
	const [selectedLanguage, setSelectedLanguage] = useState<string>("fr-FR");

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
	};

	return (
		<View>
			<Dropdown
				labelField={"label"}
				valueField={"value"}
				onChange={(item) => changeLanguage(item.value)}
				iconColor={theme.colors.textTertiary}
				value={selectedLanguage}
				data={[
					{ label: "English", value: "en-US" },
					{ label: "Français", value: "fr-FR" },
				]}
				style={{
					width: 110,
				}}
				containerStyle={{
					borderRadius: 5,
				}}
				placeholderStyle={{
					color: theme.colors.textTertiary,
					fontSize: 14,
				}}
			/>
		</View>
	);
};

export default LanguageSelector;
