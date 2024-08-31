import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import AccountBlock from "./AccountBlock";
import { View, Text, Modal, Pressable } from "react-native";
import RowBlock from "./RowBlock";
import { Iconify } from "react-native-iconify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToggleButton from "./Switch";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { disconnectUser } from "@db/users";
import CustomModal from "@components/Shared/Modal";
import CustomPressable from "@components/Shared/CustomPressable";

export default function Preferences() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const {
		setHabits,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		setPoints,
		setNotificationToggle,
		notificationToggle,
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
		setUncompletedHabitsData([]);
		setCompletedHabitsData([]);
		setPoints({ odyssee: 0, rewards: 0 });

		await disconnectUser();
		setModalVisible(false);
	};

	const handleLogout = () => {
		setModalVisible(true);
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
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				icon={
					<Iconify icon="mdi:bell-outline" size={24} color={theme.colors.text} />
				}
				title="Notifications"
				rightContent={
					<ToggleButton
						title="Notifications"
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Langue"
				icon={<Iconify icon="mdi:earth" size={24} color={theme.colors.text} />}
				rightContent={<Text style={{ color: theme.colors.text }}>Français</Text>}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Aide"
				icon={<Iconify icon="zondicons:buoy" size={22} color={theme.colors.text} />}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>
			<RowBlock
				title="À propos"
				icon={
					<Iconify icon="mdi:information" size={24} color={theme.colors.text} />
				}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>
			<RowBlock
				title="Déconnexion"
				onPress={handleLogout}
				icon={<Iconify icon="mdi:logout" size={22} color={theme.colors.text} />}
			/>

			<CustomModal
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
		</AccountBlock>
	);
}