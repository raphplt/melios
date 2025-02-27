import ToggleButton from "@components/Account/Switch";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useNotifications from "@hooks/useNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

const manageNotifications = () => {
	const { setNotificationToggle, notificationToggle } = useData();
	const { t } = useTranslation();
	const { theme } = useTheme();

	const { scheduleDailyNotification, cancelAllNotifications } =
		useNotifications();
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

	return (
		<ScrollView style={{ flex: 1, paddingTop: 40 }}>
			<ButtonClose />
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-2xl font-bold p-2 px-4"
			>
				Gestion des notifications
			</Text>

			<View className="flex flex-row justify-between items-center p-4">
				<Text>{t("notifications")}</Text>
				<ToggleButton
					onToggle={handleToggleNotifications}
					value={notificationToggle}
				/>
			</View>
		</ScrollView>
	);
};

export default manageNotifications;
