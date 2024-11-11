import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, Alert } from "react-native";

import { useTheme } from "@context/ThemeContext";
import AccountBlock from "./AccountBlock";
import RowBlock from "./RowBlock";
import { Iconify } from "react-native-iconify";
import ToggleButton from "./Switch";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { disconnectUser } from "@db/users";
import CustomModal from "@components/Shared/Modal";
import CustomPressable from "@components/Shared/CustomPressable";
import ModalWrapper from "@components/Modals/ModalWrapper";

export default function Preferences() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme, toggleTheme } = useTheme();
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
		setHabits([]);

		setPoints({ odyssee: 0, rewards: 0 });

		await disconnectUser();
		setMember(undefined);
		setModalVisible(false);
	};

	const handleLogout = () => {
		setModalVisible(true);
	};

	const goToHelp = () => {
		navigation.navigate("help");
	};

	const goAbout = () => {
		Alert.alert(
			"À propos",
			"Melios v1.1.7 - © 2024 Melios. Tous droits réservés."
		);
	};

	return (
		<AccountBlock title="Préférences">
			<RowBlock
				icon={<Iconify icon="ph:moon" size={24} color={theme.colors.text} />}
				title="Mode sombre"
				rightContent={
					<ToggleButton onToggle={handleToggleTheme} value={isDarkTheme} />
				}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				icon={
					<Iconify icon="mdi:bell-outline" size={24} color={theme.colors.text} />
				}
				title="Notifications"
				rightContent={
					<ToggleButton
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Langue"
				icon={<Iconify icon="mdi:earth" size={24} color={theme.colors.text} />}
				rightContent={<Text style={{ color: theme.colors.text }}>Français</Text>}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Aide"
				icon={<Iconify icon="zondicons:buoy" size={22} color={theme.colors.text} />}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={goToHelp}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>
			<RowBlock
				title="À propos"
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
				title="Déconnexion"
				onPress={handleLogout}
				color={theme.colors.redPrimary}
				icon={
					<Iconify icon="mdi:logout" size={22} color={theme.colors.redPrimary} />
				}
			/>

			{/* <CustomModal
				visible={modalVisible}
				onClose={setModalVisible}
				title="Déconnexion"
				subtitle="Êtes-vous sûr de vouloir vous déconnecter ?"
			>
				<CustomPressable
					text="Annuler"
					onPress={() => setModalVisible(!modalVisible)}
				/>
				<CustomPressable
					text="Confirmer"
					onPress={confirmLogout}
					bgColor={theme.colors.redPrimary}
					textColor="#fff"
				/>
			</CustomModal>
			 */}

			<ModalWrapper visible={modalVisible} setVisible={setModalVisible}>
				<View>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-lg font-semibold mb-4"
					>
						Déconnexion
					</Text>
					<Text
						style={{
							color: theme.colors.textTertiary,
						}}
						className="text-[16px]  mb-2"
					>
						Êtes-vous sûr de vouloir vous déconnecter ?
					</Text>
					<View className="flex flex-row justify-center items-center mx-auto w-11/12 mt-3">
						<CustomPressable
							text="Annuler"
							onPress={() => setModalVisible(!modalVisible)}
							bgColor={theme.colors.grayPrimary}
							textColor="#fff"
						/>
						<CustomPressable
							text="Confirmer"
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
