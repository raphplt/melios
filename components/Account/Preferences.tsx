import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Iconify } from "react-native-iconify";
import { useTranslation } from "react-i18next";

import { useTheme } from "@context/ThemeContext";
import AccountBlock from "./AccountBlock";
import RowBlock from "./RowBlock";
import ToggleButton from "./Switch";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { disconnectUser } from "@db/users";
import CustomPressable from "@components/Shared/CustomPressable";
import ModalWrapper from "@components/Modals/ModalWrapper";
import LanguageSelector from "./LanguageSelector";
import ConfidentialitySelector from "./ConfidentialitySelector";

export default function Preferences() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme, toggleTheme } = useTheme();
	const { t } = useTranslation();
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const {
		setHabits,
		setPoints,
		setNotificationToggle,
		notificationToggle,
		setMember,
	} = useData();

	const { scheduleDailyNotification, cancelAllNotifications } =
		useNotifications();

	const [modalVisible, setModalVisible] = useState(false);

	const handleToggleTheme = async () => {
		toggleTheme();
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	const handleToggleNotifications = async () => {
		const notificationEnabled = await AsyncStorage.getItem("notificationEnabled");
		if (notificationEnabled === "true") {
			await AsyncStorage.setItem("notificationEnabled", "false");
			await cancelAllNotifications();
			setNotificationToggle(false);
		} else {
			await AsyncStorage.setItem("notificationEnabled", "true");
			await scheduleDailyNotification();
			setNotificationToggle(true);
		}
	};

	const confirmLogout = async () => {
		await disconnectUser();
	};

	const handleLogout = () => {
		setModalVisible(true);
	};

	const goToHelp = () => {
		navigation.navigate("help");
	};

	const goAbout = () => {
		Alert.alert(
			t("about"),
			"Melios v1.1.7 - © 2024 Melios" + "\n" + t("all_rights_reserved")
		);
	};

	return (
		<AccountBlock title={t("preferences")}>
			<RowBlock
				icon={<Iconify icon="ph:moon" size={24} color={theme.colors.text} />}
				title={t("dark_mode")}
				rightContent={
					<ToggleButton onToggle={handleToggleTheme} value={isDarkTheme} />
				}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				icon={
					<Iconify icon="mdi:bell-outline" size={24} color={theme.colors.text} />
				}
				title={t("notifications")}
				rightContent={
					<ToggleButton
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				icon={
					<Iconify icon="iconoir:community" size={24} color={theme.colors.text} />
				}
				title={t("confidentiality")}
				rightContent={<ConfidentialitySelector />}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title={t("language")}
				icon={<Iconify icon="mdi:earth" size={24} color={theme.colors.text} />}
				rightContent={<LanguageSelector />}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title={t("help")}
				icon={<Iconify icon="zondicons:buoy" size={22} color={theme.colors.text} />}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={goToHelp}
			/>

			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title={t("about")}
				icon={
					<Iconify icon="mdi:information" size={24} color={theme.colors.text} />
				}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={goAbout}
			/>

			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title={t("logout")}
				onPress={handleLogout}
				color={theme.colors.redPrimary}
				icon={
					<Iconify icon="mdi:logout" size={22} color={theme.colors.redPrimary} />
				}
			/>

			<ModalWrapper visible={modalVisible} setVisible={setModalVisible}>
				<View>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-lg font-semibold mb-4"
					>
						{t("logout")}
					</Text>
					<Text
						style={{
							color: theme.colors.textTertiary,
						}}
						className="text-[16px]  mb-2"
					>
						{t("confirm_logout")}
					</Text>
					<View className="flex flex-row justify-center items-center mx-auto w-11/12 mt-3">
						<CustomPressable
							text={t("cancel")}
							onPress={() => setModalVisible(!modalVisible)}
							bgColor={theme.colors.grayPrimary}
							textColor="#fff"
						/>
						<CustomPressable
							text={t("confirm")}
							onPress={confirmLogout}
							bgColor={theme.colors.redPrimary}
							textColor="#fff"
						/>
					</View>
				</View>
			</ModalWrapper>
		</AccountBlock>
	);
}