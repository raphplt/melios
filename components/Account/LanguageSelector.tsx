import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import i18n from "../../i18n";

const LanguageSelector = () => {
	const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");

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
				value={selectedLanguage}
				data={[
					{ label: "English", value: "en-US" },
					{ label: "Français", value: "fr-FR" },
				]}
				style={{
					borderRadius: 10,
					width: 120,
				}}
			/>
		</View>
	);
};

export default LanguageSelector;
